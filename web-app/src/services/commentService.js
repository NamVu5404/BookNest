import httpClient from "../configurations/httpClient";
import { validateInput } from "../utils/ValidateInputUtil";

// 1. Tạo comment mới cho một bài post
export const createComment = async (postId, data) => {
  return await httpClient.post(`/posts/${postId}/comments`, validateInput(data));
};

// 2. Cập nhật comment theo id
export const updateComment = async (commentId, data) => {
  return await httpClient.put(`/posts/comments/${commentId}`, validateInput(data));
};

// 3. Xóa comment theo id
export const deleteComment = async (commentId) => {
  return await httpClient.delete(`/posts/comments/${commentId}`);
};

// 4. Lấy tất cả comment theo postId (có phân trang)
export const getAllCommentsByPostId = async (postId, page = 1, size = 10) => {
  return await httpClient.get(`/posts/${postId}/comments/all`, {
    params: { page, size },
  });
};

// 5. Lấy tất cả sub-comment của một comment cha (có phân trang)
export const getSubCommentsByParentId = async (parentId, page = 1, size = 10) => {
  return await httpClient.get(`/posts/comments/${parentId}/sub-comments/all`, {
    params: { page, size },
  });
};

// 6. Lấy lịch sử chỉnh sửa của một comment
export const getCommentEditHistory = async (commentId, page = 1, size = 10) => {
  return await httpClient.get(`/posts/comments/${commentId}/edit-history`, {
    params: { page, size },
  });
};
