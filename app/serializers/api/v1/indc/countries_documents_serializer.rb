module Api
  module V1
    module Indc
      class CountriesDocumentsSerializer < ActiveModel::Serializer
        attributes :documents, :laws, :policies, :data

        def data
          object.data.map do |datum|
            docs = ::Indc::Document.joins(values: :location).
               joins('LEFT OUTER JOIN indc_submissions ON indc_submissions.document_id = indc_documents.id AND indc_submissions.location_id = locations.id').
               where(locations: {iso_code3: datum.iso_code3}).
               select('indc_documents.*, indc_submissions.submission_date').
               order(:ordering).distinct.to_a

            if object.laws_info[datum.iso_code3]
              ordering = docs.empty? ? 0 : docs.last["ordering"]
              docs += object.laws_info[datum.iso_code3].map do |key, val|
                next unless val
                ordering += 1
                {
                  id: nil,
                  ordering: ordering,
                  slug: key.gsub('in_', ''),
                  long_name: key.gsub('in_', '').titleize,
                  description: "Targets in #{key.gsub('in_', '').titleize}",
                  is_ndc: false
                }
              end.compact
            end

            [datum.iso_code3, docs]
          end.to_h
        end

        def documents
          ::Indc::Document.order(:ordering).map do |d|
            locs = Location.where(id: ::Indc::Value.select(:location_id).where(document_id: d.id).distinct.pluck(:location_id))
            total_countries = if locs.where(iso_code3: 'EUU').any?
                                # sum the 26 countries plus EUU entry to sum 27 countries in the EU
                                # to avoid double counting
                                locs.where(is_in_eu: [nil, false]).count + 26
                              else
                                locs.count
                              end
            {
              id: d.id,
              ordering: d.ordering,
              slug: d.slug,
              long_name: d.long_name,
              description: d.description,
              is_ndc: d.is_ndc,
              total_countries: total_countries
            }
          end
        end

        def laws
          {}
        end

        def policies
          {}
        end
      end
    end
  end
end
