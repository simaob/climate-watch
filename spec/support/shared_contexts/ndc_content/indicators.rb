RSpec.shared_context 'NDC indicators' do
  include_context 'NDC sources'
  include_context 'NDC categories'

  let!(:ghg_target_type) {
    i = FactoryBot.create(
      :indc_indicator,
      source: wb,
      slug: 'ghg_target_type',
      name: 'GHG target type'
    )
    i.categories = [overview, ndc]
    i
  }

  let!(:sectoral_plans_on) {
    i = FactoryBot.create(
      :indc_indicator,
      source: wb,
      slug: 'M_SecGen3',
      name: 'Sectoral plans on'
    )
    i.categories = [sectoral_information, sectoral_plans]
    i
  }

  let!(:sectoral_targets_on) {
    i = FactoryBot.create(
      :indc_indicator,
      source: wb,
      slug: 'M_SecTar1',
      name: 'Sectoral targets on'
    )
    i.categories = [sectoral_information, sectoral_targets]
    i
  }
end
