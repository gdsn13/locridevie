class Admin::MainMenuCell < ::Admin::MenuCell

  protected

  def build_list
    add :contents, :url => admin_pages_url
    add :objects, :url => admin_object_contents_url
    add :settings, :url => edit_admin_current_site_url
  end

end
