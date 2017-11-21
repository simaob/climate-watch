require 'rails_helper'

describe Api::V1::MyCw::UserStoriesController, type: :controller do
  context do
    let!(:user) {
      FactoryGirl.create(:user)
    }
    let!(:some_user_stories) {
      FactoryGirl.create_list(:user_story, 3, user: user)
    }

    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index
        expect(response).to be_success
      end

      it 'lists all known user stories' do
        get :index
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end
    end
  end
end
