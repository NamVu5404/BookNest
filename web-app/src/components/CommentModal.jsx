import {
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  SendOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, message, Modal, Spin, Timeline, Typography } from "antd";
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../contexts/UserContext";
import { isAuthenticated } from "../services/authenticationService";
import {
  createComment as apiCreateComment,
  deleteComment as apiDeleteComment,
  updateComment as apiUpdateComment,
  getAllCommentsByPostId,
  getSubCommentsByParentId,
  getCommentEditHistory
} from "../services/commentService";
import { getUid } from "../services/localStorageService";
import LoginRequiredModal from "./LoginRequiredModal";

const { Text } = Typography;
const { confirm } = Modal;

const CommentModal = ({ commentCount, visible, postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState(commentCount);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [subComments, setSubComments] = useState({});
  const [replying, setReplying] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentHistory, setCommentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [subCommentPages, setSubCommentPages] = useState({});
  const [hasMoreSubComments, setHasMoreSubComments] = useState({});
  const [loadingSubComments, setLoadingSubComments] = useState({});
  const [loadingAction, setLoadingAction] = useState({});
  const [loadingDelete, setLoadingDelete] = useState({});
  const [loadingEdit, setLoadingEdit] = useState({});
  const { userDetails } = useUserDetails();

  const commentInputRef = useRef(null);
  const navigate = useNavigate();
  const commentListRef = useRef(null);

  const fetchComments = async (postId, page) => {
    setLoading(true);
    try {
      const response = await getAllCommentsByPostId(postId, page);
      if (response.data && response.data.result) {
        const newComments = response.data.result.data || [];
        setComments(prev => page === 1 ? newComments : [...prev, ...newComments]);
        setPage(response.data.result.currentPage);
        setHasMore(response.data.result.currentPage < response.data.result.totalPages);
      }
    } catch (error) {
      console.error("Lỗi khi tải comments", error);
      message.error(error.response?.data?.message || "Lỗi khi tải comments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubComments = async (parentId, page = 1) => {
    setLoadingSubComments(prev => ({ ...prev, [parentId]: true }));
    try {
      const response = await getSubCommentsByParentId(parentId, page);
      if (response.data && response.data.result) {
        const subCommentData = response.data.result.data || [];
        const currentPage = response.data.result.currentPage;
        const hasMore = response.data.result.currentPage < response.data.result.totalPages;

        setSubComments(prev => ({
          ...prev,
          [parentId]: page === 1 ? subCommentData : [...(prev[parentId] || []), ...subCommentData]
        }));

        setSubCommentPages(prev => ({
          ...prev,
          [parentId]: currentPage
        }));

        setHasMoreSubComments(prev => ({
          ...prev,
          [parentId]: hasMore
        }));
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi tải phản hồi!");
      console.error("Lỗi khi tải phản hồi:", error);
    } finally {
      setLoadingSubComments(prev => ({ ...prev, [parentId]: false }));
    }
  };

  const createComment = async (postId, content, parentId = null) => {
    if (!isAuthenticated()) {
      setShowLoginRequiredModal(true);
      return;
    }

    setLoadingComment(true);
    try {
      const response = await apiCreateComment(postId, { content, parentId });

      if (response?.data && response?.data?.result) {
        const newComment = response.data.result;

        if (parentId) {
          setSubComments(prev => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), newComment]
          }));

          // Cập nhật số lượng subComment cho comment cha
          const updateParentCount = (commentList, targetId) => {
            return commentList.map(comment => {
              if (comment.id === targetId) {
                return { ...comment, subComment: (comment.subComment || 0) + 1 };
              }
              return comment;
            });
          };

          // Cập nhật count trong comments chính
          setComments(prev => updateParentCount(prev, parentId));

          // Cập nhật count trong subComments
          setSubComments(prev => {
            const newSubComments = { ...prev };
            Object.keys(newSubComments).forEach(key => {
              newSubComments[key] = updateParentCount(newSubComments[key], parentId);
            });
            return newSubComments;
          });

          setReplying(null);
          setReplyContent('');
          setTotalComments(prev => prev + 1);
        } else {
          setComments(prev => [newComment, ...prev]);
          setCommentContent('');
          setTotalComments(prev => prev + 1); // Thêm dòng này để cập nhật khi thêm comment chính
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm bình luận!");
      console.error("Lỗi khi thêm bình luận:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  const updateComment = async (id, content) => {
    setLoadingEdit(prev => ({ ...prev, [id]: true }));
    try {
      const response = await apiUpdateComment(id, { content });

      if (response.data && response.data.result) {
        const isSubComment = !comments.find(c => c.id === id);

        if (isSubComment) {
          setSubComments(prev => {
            const newSubComments = { ...prev };
            Object.keys(newSubComments).forEach(parentId => {
              newSubComments[parentId] = newSubComments[parentId].map(comment =>
                comment.id === id
                  ? { ...comment, content, updated: true }
                  : comment
              );
            });
            return newSubComments;
          });
        } else {
          setComments(prev => prev.map(comment =>
            comment.id === id
              ? { ...comment, content, updated: true }
              : comment
          ));
        }

        setEditingComment(null);
        setEditContent('');
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật bình luận!");
      console.error("Lỗi khi cập nhật bình luận:", error);
    } finally {
      setLoadingEdit(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteComment = async (id) => {
    setLoadingDelete(prev => ({ ...prev, [id]: true }));
    try {
      await apiDeleteComment(id);

      const mainComment = comments.find(c => c.id === id);

      if (mainComment) {
        setComments(prev => prev.filter(comment => comment.id !== id));
        setTotalComments(prev => prev - 1); // Giảm 1 cho comment chính

        const subCount = mainComment.subComment || 0;
        if (subCount > 0) {
          setTotalComments(prev => prev - 1);
          delete subComments[id];
          setSubComments({ ...subComments });
        }
      } else {
        // Xóa subcomment
        let parentId = null;
        Object.keys(subComments).forEach(pId => {
          if (subComments[pId].some(sc => sc.id === id)) {
            parentId = pId;
          }
        });

        if (parentId) {
          setSubComments(prev => ({
            ...prev,
            [parentId]: prev[parentId].filter(sc => sc.id !== id)
          }));

          setComments(prev => prev.map(comment =>
            comment.id === parentId
              ? { ...comment, subComment: Math.max(0, comment.subComment - 1) }  
              : comment
          ));

          setTotalComments(prev => prev - 1); // Giảm 1 cho subcomment bị xóa
        }
      }

      message.success("Đã xóa bình luận thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa bình luận!");
      console.error("Lỗi khi xóa bình luận:", error);
    } finally {
      setLoadingDelete(prev => ({ ...prev, [id]: false }));
    }
  };

  const getCommentHistory = async (commentId) => {
    setLoadingHistory(true);
    setIsHistoryModalVisible(true);

    try {
      const response = await getCommentEditHistory(commentId, 1, 999);

      if (response.data && response.data.result) {
        setCommentHistory(response.data.result.data || []);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi tải lịch sử bình luận!");
      console.error("Lỗi khi tải lịch sử bình luận:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleComment = () => {
    if (!commentContent.trim()) return;
    createComment(postId, commentContent.trim());
  };

  const handleReply = (commentId) => {
    if (!replyContent.trim()) return;
    setLoadingAction(prev => ({ ...prev, [commentId]: true }));
    createComment(postId, replyContent.trim(), commentId).finally(() => {
      setLoadingAction(prev => ({ ...prev, [commentId]: false }));
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
      fetchComments(postId, page + 1);
    }
  };

  const handleReplyClick = (commentId) => {
    if (!isAuthenticated()) {
      setShowLoginRequiredModal(true);
      return;
    }
    setReplying(commentId);
    setTimeout(() => {
      const replyInput = document.getElementById(`reply-input-${commentId}`);
      if (replyInput) {
        replyInput.focus();
      }
    }, 100);
  };

  const handleEditClick = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
    setTimeout(() => {
      const editInput = document.getElementById(`edit-input-${comment.id}`);
      if (editInput) {
        editInput.focus();
      }
    }, 100);
  };

  const showDeleteConfirm = (commentId) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa bình luận này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      maskClosable: true,
      okButtonProps: {
        type: "primary",
        danger: true,
      },
      onOk() {
        deleteComment(commentId);
      },
    });
  };

  const handleViewSubComments = (commentId) => {
    if (!subComments[commentId]) {
      fetchSubComments(commentId, 1);
    }
  };

  const handleLoadMoreSubComments = (parentId) => {
    if (hasMoreSubComments[parentId] && !loadingSubComments[parentId]) {
      const nextPage = (subCommentPages[parentId] || 1) + 1;
      fetchSubComments(parentId, nextPage);
    }
  };

  const handleViewHistory = (commentId) => {
    getCommentHistory(commentId);
  };

  const purifyConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'strike',
      'span', 'div'
    ],
    ALLOWED_ATTR: [
      'style', 'class',
    ],
  };

  useEffect(() => {
    if (visible) {
      setTotalComments(commentCount);
      setComments([]);
      setPage(1);
      fetchComments(postId, 1);
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus();
        }
      }, 300);
    }
  }, [visible, postId, commentCount]);

  const renderComment = (comment, isSubComment = false, parentComment = null) => (
    <div key={comment.id} style={{ marginTop: isSubComment ? '12px' : '16px' }}>
      {comment.profile?.userId ? (
        <div style={{ display: 'flex' }}>
          {comment.profile?.avatar ? (
            <Avatar
              src={comment.profile.avatar}
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "50%",
                objectFit: 'cover',
                marginRight: 16
              }}
            />
          ) : (
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "50%",
                objectFit: 'cover',
                marginRight: 16
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            {editingComment === comment.id ? (
              <div style={{ marginBottom: '8px' }}>
                <Input.TextArea
                  id={`edit-input-${comment.id}`}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{
                    marginBottom: '8px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <div>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => updateComment(comment.id, editContent)}
                    loading={loadingEdit[comment.id]}
                    disabled={!editContent.trim() || editContent === comment.content}
                  >
                    Lưu
                  </Button>
                  <Button
                    size="small"
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '18px',
                  padding: '8px 12px'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span
                      onClick={() => navigate(`/profile/${comment.profile.userId}`)}
                      style={{ fontWeight: 500, cursor: 'pointer' }}
                    >
                      {comment.profile.fullName}
                    </span>
                    {isSubComment && parentComment && (
                      <>
                        {" "}<CaretRightOutlined />{" "}
                        {parentComment.profile?.userId ? (
                          <span
                            onClick={() => navigate(`/profile/${parentComment.profile.userId}`)}
                            style={{ fontWeight: 500, cursor: 'pointer' }}
                          >
                            {parentComment.profile.fullName}
                          </span>
                        ) : (
                          <i>Bình luận đã bị xóa</i>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    style={{ fontSize: '14px' }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(comment.content, purifyConfig)
                    }}
                  />
                </div>

                <div style={{ display: 'flex', marginTop: '4px', fontSize: '13px' }}>
                  <Text type="secondary" style={{ marginRight: '8px', fontSize: 13 }}>
                    {comment.elapsedTime}
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleReplyClick(comment.id)}
                    style={{
                      padding: '0',
                      height: 'auto',
                      fontSize: '13px',
                      color: 'rgba(0, 0, 0, 0.45)'
                    }}
                  >
                    Phản hồi
                  </Button>

                  {comment.profile.userId === getUid() && (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'edit',
                            icon: <EditOutlined style={{ fontSize: '14px' }} />,
                            label: <span style={{ fontSize: '14px' }}>Chỉnh sửa</span>,
                            onClick: () => handleEditClick(comment),
                            disabled: loadingDelete[comment.id] || loadingEdit[comment.id]
                          },
                          {
                            key: 'delete',
                            icon: <DeleteOutlined style={{ fontSize: '14px' }} />,
                            label: loadingDelete[comment.id] ?
                              <span style={{ fontSize: '14px' }}>Đang xóa...</span> :
                              <span style={{ fontSize: '14px' }}>Xóa</span>,
                            danger: true,
                            onClick: () => showDeleteConfirm(comment.id),
                            disabled: loadingDelete[comment.id] || loadingEdit[comment.id]
                          }
                        ]
                      }}
                      placement="bottomLeft"
                      trigger={['click']}
                      disabled={loadingDelete[comment.id] || loadingEdit[comment.id]}
                    >
                      <Button
                        type="link"
                        size="small"
                        icon={<EllipsisOutlined />}
                        style={{
                          padding: '0',
                          height: 'auto',
                          marginLeft: '8px',
                          color: 'rgba(0, 0, 0, 0.45)'
                        }}
                        loading={loadingDelete[comment.id] || loadingEdit[comment.id]}
                      />
                    </Dropdown>
                  )}

                  {comment.updated && (
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'history',
                            icon: <HistoryOutlined style={{ fontSize: '14px' }} />,
                            label: <span style={{ fontSize: '14px' }}>Lịch sử chỉnh sửa</span>,
                            onClick: () => handleViewHistory(comment.id)
                          }
                        ]
                      }}
                      placement="bottomLeft"
                      trigger={['click']}
                    >
                      <Button
                        type="link"
                        size="small"
                        style={{
                          padding: '0',
                          height: 'auto',
                          marginLeft: '8px',
                          color: 'rgba(0, 0, 0, 0.45)',
                          fontSize: 13
                        }}
                      >
                        Đã chỉnh sửa
                      </Button>
                    </Dropdown>
                  )}
                </div>

                {comment.subComment > 0 && !subComments[comment.id] && (
                  <div style={{ marginTop: '4px' }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleViewSubComments(comment.id)}
                      style={{
                        padding: '0',
                        height: 'auto',
                        fontSize: '13px',
                        // fontWeight: 900,
                        color: 'rgba(0, 0, 0, 0.76)'
                      }}
                    >
                      Xem {comment.subComment} phản hồi
                    </Button>
                  </div>
                )}
              </div>
            )}

            {replying === comment.id && (
              <div style={{
                display: 'flex',
                marginTop: '8px',
                alignItems: "center"
              }}>
                {userDetails?.avatar ? (
                  <Avatar
                    src={userDetails.avatar}
                    style={{
                      width: 24,
                      height: 24,
                      flexShrink: 0,
                      borderRadius: "50%",
                      objectFit: 'cover',
                      marginRight: 16
                    }}
                  />
                ) : (
                  <Avatar
                    size={24}
                    icon={<UserOutlined />}
                    style={{
                      width: 24,
                      height: 24,
                      flexShrink: 0,
                      borderRadius: "50%",
                      objectFit: 'cover',
                      marginRight: 16
                    }}
                  />
                )}
                <Input.TextArea
                  id={`reply-input-${comment.id}`}
                  placeholder={`Phản hồi ${comment.profile.fullName}...`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  style={{
                    flex: 1,
                    borderRadius: '18px',
                    fontSize: '14px',
                    resize: 'none'
                  }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleReply(comment.id);
                    }
                  }}
                />
                <Button
                  type="primary"
                  size="small"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={() => handleReply(comment.id)}
                  style={{ marginLeft: 8 }}
                  loading={loadingAction[comment.id]}
                  disabled={!replyContent.trim()}
                />
              </div>
            )}

            {subComments[comment.id] && (
              <div style={{ marginTop: '16px' }}>
                {subComments[comment.id].map(subComment => (
                  renderComment(subComment, true, comment)
                ))}
                {hasMoreSubComments[comment.id] && (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button
                      type="link"
                      onClick={() => handleLoadMoreSubComments(comment.id)}
                      disabled={loadingSubComments[comment.id]}
                    >
                      {loadingSubComments[comment.id] ? <Spin /> : "Tải thêm phản hồi"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        (comment.subComment > 0 && <div>
          <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '18px',
            padding: '8px 12px',
            width: "100%",
            marginTop: '12px'
          }}>
            <i>Bình luận đã bị xóa</i>
          </div>

          {comment.subComment > 0 && !subComments[comment.id] && (
            <div style={{ marginTop: '4px' }}>
              <Button
                type="link"
                size="small"
                onClick={() => handleViewSubComments(comment.id)}
                style={{
                  padding: '0',
                  height: 'auto',
                  fontSize: '13px',
                  color: 'rgba(0, 0, 0, 0.76)'
                }}
              >
                Xem {comment.subComment} phản hồi
              </Button>
            </div>
          )}

          {subComments[comment.id] && (
            <div style={{
              marginTop: '16px',
              paddingLeft: '44px' // Thêm padding left để thụt lề giống như comment bình thường
            }}>
              {subComments[comment.id].map(subComment => (
                renderComment(subComment, true, comment)
              ))}
              {hasMoreSubComments[comment.id] && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button
                    type="link"
                    onClick={() => handleLoadMoreSubComments(comment.id)}
                    disabled={loadingSubComments[comment.id]}
                  >
                    {loadingSubComments[comment.id] ? <Spin /> : "Tải thêm phản hồi"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>)
      )}
    </div>
  );

  return (
    <>
      <Modal
        title={
          <div style={{
            borderBottom: '1px solid #f0f0f0',
            fontSize: '18px',
            fontWeight: 600,
            paddingBottom: '10px'
          }}>
            Bình luận ({totalComments})
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        centered
        maskClosable={true}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <div style={{
          display: 'flex',
          padding: '16px 0',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '16px',
          alignItems: "center",
        }}>
          {userDetails?.avatar ? (
            <Avatar
              src={userDetails.avatar}
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "50%",
                objectFit: 'cover',
                marginRight: 16
              }}
            />
          ) : (
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: "50%",
                objectFit: 'cover',
                marginRight: 16
              }}
            />
          )}
          <Input.TextArea
            ref={commentInputRef}
            placeholder="Viết bình luận..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleComment();
              }
            }}
            style={{
              resize: 'none',
              borderRadius: '18px',
              fontSize: '15px',
              padding: '8px 12px',
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleComment}
            style={{ marginLeft: 12 }}
            disabled={!commentContent.trim()}
            loading={loadingComment}
          />
        </div>

        <div
          ref={commentListRef}
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {comments.map(comment => renderComment(comment))}

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin />
            </div>
          )}

          {!loading && hasMore && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button type="link" onClick={handleLoadMore}>
                Tải thêm bình luận
              </Button>
            </div>
          )}

          {!loading && comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text type="secondary">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</Text>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        title="Lịch sử chỉnh sửa"
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setCommentHistory([]);
        }}
        footer={null}
        width={500}
        centered
        styles={{
          body: {
            maxHeight: '80vh',
            overflowY: 'auto',
          }
        }}
      >
        {loadingHistory ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <Timeline
            style={{ marginTop: '20px' }}
            items={commentHistory.map((item, index) => ({
              color: index === 0 ? 'green' : 'blue',
              children: (
                <div>
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: index === 0 ? '#f6ffed' : '#f5f5f5',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(item.content, purifyConfig)
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 13 }}>{item.elapsedTime}</Text>
                  {index === 0 && (
                    <Text type="success" style={{ marginLeft: '8px', fontSize: 13 }}>
                      (Hiện tại)
                    </Text>
                  )}
                </div>
              ),
            }))}
          />
        )}
      </Modal>

      <LoginRequiredModal
        visible={showLoginRequiredModal}
        onClose={() => setShowLoginRequiredModal(false)}
      />
    </>
  );
};

export default CommentModal;