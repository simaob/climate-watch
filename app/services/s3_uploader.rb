class S3Uploader
  include Singleton
  def initialize
    @bucket_name = ENV['S3_BUCKET_NAME']
    @s3 = Aws::S3::Resource.new(region: ENV['AWS_REGION'])
  end

  def call(s3_file, folder_name)
    path_with_folder_on_s3 = "#{folder_name}/#{s3_file.filename}"

    obj = @s3.bucket(@bucket_name).object(path_with_folder_on_s3)
    obj.upload_file(path_to_file(s3_file))
  end

  private

  def path_to_file(s3_file)
    active_storage_disk_service =
      ActiveStorage::Service::DiskService.new(root: Rails.root.to_s + '/storage/')
    active_storage_disk_service.send(:path_for, s3_file.blob.key)
  end
end
