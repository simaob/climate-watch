class ImportNdcFullTexts
  def call
    Ndc.delete_all
    bucket_name = Rails.application.secrets.s3_bucket_name
    s3 = Aws::S3::Client.new
    s3.list_objects(bucket: bucket_name, prefix: 'ndcs').each do |response|
      md_objects = response.contents.select { |o| o.key =~ /\.html$/ }
      md_objects.each { |object| import_object(s3, bucket_name, object) }
    end
  end

  private

  def import_object(s3, bucket_name, object)
    object.key =~ /ndcs\/(.+?)(-.+)?.html/
    code = Regexp.last_match[1]
    location = Location.find_by_iso_code3(code)
    unless location
      Rails.logger.warn "Location not found: #{code}"
      return
    end
    file = s3.get_object(bucket: bucket_name, key: object.key)
    html_content = html_content_with_resolved_image_paths(file.body.read)

    Ndc.create(location: location, full_text: html_content)
  end

  def html_content_with_resolved_image_paths(html_content)
    begin
      page = Nokogiri::HTML(html_content)
      page.css('img').each do |img|
        img['src'] = "#{S3_BUCKET_URL}/ndcs/#{img['src']}"
      end
      html_content = page.to_html
    rescue Nokogiri::SyntaxError => e
      Rails.logger.error e.message
      Rails.logger.error e.backtrace.join("\n")
    end
    html_content
  end
end