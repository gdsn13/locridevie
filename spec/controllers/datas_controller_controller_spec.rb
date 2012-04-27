require 'spec_helper'

describe DatasControllerController do

  describe "GET 'spectacle_list'" do
    it "should be successful" do
      get 'spectacle_list'
      response.should be_success
    end
  end

end
