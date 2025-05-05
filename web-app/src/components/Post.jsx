import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  HeartFilled,
  HeartOutlined,
  HistoryOutlined,
  ShareAltOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, message, Modal, Spin, Timeline, Typography, List, Tooltip } from "antd";
import DOMPurify from 'dompurify';
import React, { forwardRef, useEffect, useRef, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from "react-router-dom";
import '../assets/css/Post.css';
import { getUid } from "../services/localStorageService";
import { deletePost, getPostHistory, updatePost } from "../services/postService";
import { isAuthenticated } from "../services/authenticationService";
import LoginRequiredModal from "../components/LoginRequiredModal"
import { toggleLike, getAllUserLiked } from "../services/likePostService";
import CommentModal from "./CommentModal";

const { Text } = Typography;
const { confirm } = Modal;

const Post = forwardRef((props, ref) => {
  const { post = {} } = props;
  const { profile, elapsedTime, content, likes = 0, comments = 0, liked = false } = post;

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedContent, setEditedContent] = useState(content || '');
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxHeight = 300;
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const [postEditHistory, setPostHistory] = useState([]);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const [isLikesModalVisible, setIsLikesModalVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadMoreLikes = async (page) => {
    if (!hasMore || loadingLikes) return;
    
    try {
      setLoadingLikes(true);
      const response = await getAllUserLiked(post.id, page);
      const newUsers = response.data?.result.data || [];
      const totalPages = response.data?.result.totalPages || 1;
      
      setLikedUsers(prev => page === 1 ? newUsers : [...prev, ...newUsers]);
      setHasMore(page < totalPages);
      setCurrentPage(page);
    } catch (error) {
      message.error("Không thể tải danh sách người đã thích");
    } finally {
      setLoadingLikes(false);
      setInitialLoad(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      setShowLoginRequiredModal(true);
      return;
    }

    try {
      if (isLiked) {
        setLikeCount(prevCount => prevCount - 1);
      } else {
        setLikeCount(prevCount => prevCount + 1);
      }
      setIsLiked(!isLiked);

      await toggleLike(post.id);
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi yêu thích bài viết!");
      console.error("Lỗi khi yêu thích bài viết:", error);
    }
  };

  const handleComment = () => {
    setIsCommentModalVisible(true);
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCloseModal = () => {
    setShowLoginRequiredModal(false);
  };

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [post.id]);

  const handleViewHistory = async () => {
    try {
      setLoadingHistory(true);
      setIsHistoryModalVisible(true);
      const response = await getPostHistory(post.id, 1, 999);
      setPostHistory(response.data?.result.data);
      console.log(response.data?.result.data);

    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi lấy lịch sử bài viết!");
      console.error("Lỗi khi lấy lịch sử bài viết:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleViewLikes = async () => {
    if (likeCount > 0) {
      setIsLikesModalVisible(true);
      setCurrentPage(1);
      setHasMore(true);
      setInitialLoad(true);
      setLikedUsers([]);
      loadMoreLikes(1);
    }
  };

  const handleModalScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loadingLikes && hasMore) {
      loadMoreLikes(currentPage + 1);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
    keyboard: {
      bindings: {
        tab: false
      }
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  const purifyConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'strike',
      'ul', 'ol', 'li',
      'a', 'h1', 'h2',
      'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'style', 'class',
      'data-align',
      'align'
    ],
  };

  useEffect(() => {
    if (isEditModalVisible) {
      setEditedContent(content);
    }
  }, [isEditModalVisible, content]);

  const handleUpdate = () => {
    setIsEditModalVisible(true);
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      const cleanContent = editedContent.replace(/<p><br><\/p>/g, '').trim();

      if (!cleanContent) {
        message.error("Nội dung không được để trống!");
        return;
      }

      if (cleanContent === content) {
        setIsEditModalVisible(false);
        return;
      }

      await updatePost(post.id, { content: cleanContent });
      console.log("Nội dung đã chỉnh sửa:", editedContent);
      setIsEditModalVisible(false);
      message.success("Cập nhật bài viết thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật bài viết thất bại!");
      console.error("Lỗi khi cập nhật bài viết:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      message.success("Xóa bài viết thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Xóa bài viết thất bại!");
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa bài viết này?",
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
        handleDelete(post.id);
      },
    });
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "row", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate(`/profile/${profile.userId}`)}
        >
          {profile.avatar ? (
            <Avatar
              src={profile.avatar}
              size="large"
              style={{ marginRight: 12 }}
            />
          ) : (
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ marginRight: 12 }}
            />
          )}
          <div>
            <Text strong>{profile.fullName}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: "13px" }}>
                {elapsedTime}
              </Text>

              {post.updated && <Text type="secondary" style={{ fontSize: "12px" }}>
                {" "}(Đã chỉnh sửa)
              </Text>}
            </div>
          </div>
        </div>

        {(profile.userId === getUid() || post.updated) && (
          <Dropdown
            menu={{
              items: [
                ...(profile.userId === getUid() ? [
                  {
                    key: 'edit',
                    icon: <EditOutlined style={{ fontSize: '16px' }} />,
                    label: <span style={{ fontSize: '15px' }}>Chỉnh sửa bài viết</span>,
                    onClick: handleUpdate
                  },
                  {
                    key: 'delete',
                    icon: <DeleteOutlined style={{ fontSize: '16px' }} />,
                    label: <span style={{ fontSize: '15px' }}>Xóa bài viết</span>,
                    danger: true,
                    onClick: showDeleteConfirm
                  }
                ] : []),
                ...(post.updated ? [
                  {
                    key: 'history',
                    icon: <HistoryOutlined style={{ fontSize: '16px' }} />,
                    label: <span style={{ fontSize: '15px' }}>Lịch sử chỉnh sửa</span>,
                    onClick: handleViewHistory
                  }
                ] : [])
              ]
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              style={{
                fontSize: 24,
              }}
            />
          </Dropdown>
        )}
      </div>

      <div className="post-content-wrapper">
        <div
          style={{
            fontSize: '15px',
            maxHeight: isExpanded ? 'none' : maxHeight,
            overflow: 'hidden',
            position: 'relative',
            transition: 'max-height 0.3s ease-out',
          }}
          className="post-content"
        >
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, purifyConfig) }} />
          {!isExpanded && contentHeight > maxHeight && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '50px',
                background: 'linear-gradient(transparent, white)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>

        <div
          ref={contentRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 'auto',
            width: '100%'
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, purifyConfig) }}
        />

        {contentHeight > maxHeight && (
          <Button
            type="link"
            onClick={toggleContent}
            style={{
              padding: '4px 0',
              fontSize: '14px',
              fontWeight: 500,
              marginTop: 0,
            }}
          >
            {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
          </Button>
        )}
      </div>

      <div className="post-actions" style={{
        display: 'flex',
        alignItems: 'center',
        paddingTop: 8,
        borderTop: '1px solid #f0f0f0',
        marginTop: '12px'
      }}>
        <Button
          type="text"
          icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
          onClick={handleLike}
          style={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}
        >
          <Tooltip title={likeCount > 0 ? "Xem những người đã thích" : null}>
            <span 
              className="likePost-count"
              style={{ 
                marginLeft: '4px', 
                cursor: likeCount > 0 ? 'pointer' : 'default',
                color: likeCount > 0 ? '#1677ff' : 'inherit',
                transition: 'color 0.3s',
              }} 
              onClick={(e) => {
                if (likeCount > 0) {
                  e.stopPropagation();
                  handleViewLikes();
                }
              }}
            >
              {likeCount > 0 ? likeCount : ''}
            </span>
          </Tooltip>
        </Button>

        <Button
          type="text"
          icon={<CommentOutlined />}
          onClick={handleComment}
          style={{ fontSize: '15px', display: 'flex', alignItems: 'center', marginLeft: '8px' }}
        >
          <span style={{ marginLeft: '4px' }}>{comments > 0 ? comments : ''}</span>
        </Button>

        <Button
          type="text"
          icon={<ShareAltOutlined />}
          style={{ fontSize: '15px', marginLeft: '8px' }}
        >
          <span style={{ marginLeft: '4px' }}>Chia sẻ</span>
        </Button>
      </div>

      <Modal
        title={
          <div style={{
            borderBottom: '1px solid #f0f0f0',
            fontSize: '18px',
            fontWeight: 600,
          }}>
            Chỉnh sửa bài viết
          </div>
        }
        open={isEditModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
        centered
        maskClosable={false}
        style={{ top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 100px)',
            overflow: 'auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
          }
        }}
        okButtonProps={{
          size: 'large',
          style: { minWidth: 100 },
          loading: updateLoading
        }}
        cancelButtonProps={{
          size: 'large',
          style: { minWidth: 80 }
        }}
      >
        {isEditModalVisible && (
          <div style={{ height: '450px' }}>
            <div className="quill-editor">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editedContent}
                onChange={setEditedContent}
                modules={modules}
                formats={formats}
                style={{
                  height: '400px',
                  marginBottom: '20px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                }}
                preserveWhitespace={true}
                bounds=".quill-editor"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <div style={{
            borderBottom: '1px solid #f0f0f0',
            fontSize: '18px',
            fontWeight: 600,
          }}>
            Lịch sử chỉnh sửa
          </div>
        }
        open={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setPostHistory([]);
        }}
        footer={null}
        width={800}
        centered
        maskClosable={true}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 100px)',
            overflow: 'auto',
          }
        }}
      >
        {loadingHistory ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <Timeline>
            {postEditHistory.map((history, index) => (
              <Timeline.Item key={history.id}>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {history.elapsedTime}
                    </Text>
                    {index === 0 && (
                      <Text type="success" style={{ marginLeft: '10px', fontSize: 13 }}>
                        Hiện tại
                      </Text>
                    )}
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '15px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(history.content, purifyConfig)
                    }}
                  />
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Modal>

      <Modal
        title={
          <div style={{
            borderBottom: '1px solid #f0f0f0',
            fontSize: '18px',
            fontWeight: 600,
            padding: '16px 24px',
            marginLeft: -24,
            marginRight: -24,
            marginTop: -16
          }}>
            Những người đã thích
          </div>
        }
        open={isLikesModalVisible}
        onCancel={() => {
          setIsLikesModalVisible(false);
          setLikedUsers([]);
          setCurrentPage(1);
          setHasMore(true);
        }}
        footer={null}
        width={400}
        centered
        modalRender={(modal) => modal}
      >
        <div 
          onScroll={handleModalScroll} 
          style={{ 
            maxHeight: '60vh', 
            overflowY: 'auto',
            marginRight: -24,
            marginLeft: -24,
            padding: '0 24px'
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={likedUsers}
            renderItem={(user) => (
              <List.Item style={{ padding: '12px 0' }}>
                <List.Item.Meta
                  avatar={
                    <div 
                      onClick={() => {
                        navigate(`/profile/${user.userId}`);
                        setIsLikesModalVisible(false);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {user.avatar ? (
                        <Avatar 
                          className="liked-user-avatar"
                          src={user.avatar} 
                          style={{ 
                            width: 40, 
                            height: 40,
                            transition: 'transform 0.3s',
                          }} 
                        />
                      ) : (
                        <Avatar 
                          className="liked-user-avatar"
                          icon={<UserOutlined />} 
                          style={{ 
                            width: 40, 
                            height: 40,
                            transition: 'transform 0.3s',
                          }} 
                        />
                      )}
                    </div>
                  }
                  title={
                    <Link
                      to={`/profile/${user.userId}`}
                      className="liked-user-name"
                      style={{ 
                        color: 'inherit',
                        fontSize: '15px',
                        fontWeight: 500,
                      }}
                    >
                      {user.fullName}
                    </Link>
                  }
                />
              </List.Item>
            )}
            locale={{
              emptyText: initialLoad ? 
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin />
                </div> : 
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  Chưa có người thích bài viết này
                </div>
            }}
          />
          {loadingLikes && hasMore && !initialLoad && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin />
            </div>
          )}
        </div>
      </Modal>

      <CommentModal
        commentCount={comments}
        visible={isCommentModalVisible}
        postId={post.id}
        post={post}
        onClose={() => setIsCommentModalVisible(false)}
      />

      <LoginRequiredModal isOpen={showLoginRequiredModal} onClose={handleCloseModal} />
    </div>
  );
});

export default Post;
