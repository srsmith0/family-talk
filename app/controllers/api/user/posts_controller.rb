class Api::User::PostsController < ApplicationController
  before_action :set_user 
  
  def index 
    render json: @user.posts
  end

  def create
    post = @user.posts.new
    post.name = params[:name] ? params[:name] : post.name
    post.description = params[:description] ? params[:description] : post.description
    post.public = params[:public] ? params[:public] : post.public

    file = params[:file]
     binding.pry
    if file != "undefined" && file != "" 
       begin
        ext = File.extname(file.tempfile)
         cloud_image = Cloudinary::Uploader.upload(file, public_id: file.original_filename, secure: true, resource_type: :auto)
         post.image = cloud_image["secure_url"]
         rescue => e
           render json: {errors: e, status: 422}
           return
         end
     end

    if post.save
      render json: post
      
    else
      render json: { errors: post.errors }, status: :unprocessble_entity
    end
  end

  def update
    post = @user.posts.find(params[:id])
    post.name = params[:name] ? params[:name] : post.name
    post.description = params[:description] ? params[:description] : post.description
    post.public = params[:public] ? params[:public] : post.public

    file = params[:file]
     
    if file != "undefined" && file != "" 
       begin
        ext = File.extname(file.tempfile)
         cloud_image = Cloudinary::Uploader.upload(file, public_id: file.original_filename, secure: true, resource_type: :auto)
         post.image = cloud_image["secure_url"]
         rescue => e
           render json: {errors: e, status: 422}
           return
         end
     end

    if post.update(post_params)
      render json: post
    else
      render json: {errors: post.errors}, status: :unprocessble_entity
    end
  end

  def destroy
    render json: @user.posts.find(params[:id]).destroy
  end

  private
  def set_board
    @board = Board.find(params[:board_id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  def post_params
    params.require(:post).permit(:title, :description, :board_id, :user_id)
  end
end
