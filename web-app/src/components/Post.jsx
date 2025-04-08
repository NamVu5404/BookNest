import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, message, Modal, Space, Spin, Timeline, Tooltip, Typography } from "antd";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import ReactQuill from 'react-quill';
import { getUid } from "../services/localStorageService";
import { deletePost, getPostHistory, updatePost } from "../services/postService";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import '../css/Post.css';

const { Text } = Typography;
const { confirm } = Modal;

const Post = forwardRef((props, ref) => {
  const { userId, avatar, fullName, elapsedTime, content } = props.post;

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxHeight = 300;
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const [postHistory, setPostHistory] = useState([]);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [props.post.id]);

  const handleViewHistory = async () => {
    try {
      setLoadingHistory(true);
      setIsHistoryModalVisible(true);
      const response = await getPostHistory(props.post.id, 1, 999);
      setPostHistory(response.data?.result.data);
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi lấy lịch sử bài viết!");
      console.error("Lỗi khi lấy lịch sử bài viết:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }], // Tiêu đề
      ['bold', 'italic', 'underline', 'strike'], // Định dạng văn bản
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Danh sách
      [{ 'align': [] }], // Căn chỉnh
      ['link', 'image'], // Chèn liên kết và hình ảnh
      ['clean'], // Xóa định dạng
    ],
    clipboard: {
      matchVisual: false, // Tắt việc so khớp định dạng khi paste
    },
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
      // Đảm bảo content được set sau khi modal hiển thị
      setEditedContent(content);
    }
  }, [isEditModalVisible, content]);

  const handleUpdate = () => {
    setIsEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      // Chỉ loại bỏ các thẻ p rỗng
      const cleanContent = editedContent.replace(/<p><br><\/p>/g, '').trim();

      // Kiểm tra nội dung rỗng
      if (!cleanContent) {
        message.error("Nội dung không được để trống!");
        return;
      }

      // Kiểm tra nội dung có thay đổi
      if (cleanContent === content) {
        setIsEditModalVisible(false);
        return;
      }

      await updatePost(props.post.id, { content: cleanContent });
      console.log("Nội dung đã chỉnh sửa:", editedContent);
      setIsEditModalVisible(false); // Đóng modal sau khi lưu
      message.success("Cập nhật bài viết thành công!");
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật bài viết thất bại!");
      console.error("Lỗi khi cập nhật bài viết:", error);
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
        handleDelete(props.post.id);
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
        {/* Avatar và thông tin người dùng */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          {avatar ? (
            <Avatar
              src={avatar}
              size="large"
              style={{ cursor: "pointer", marginRight: 12 }}
            />
          ) : (
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: "pointer", marginRight: 12 }}
            />
          )}
          <div>
            <Text strong>{fullName}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {elapsedTime}
              </Text>

              {props.post.updated && <Text type="secondary" style={{ fontSize: "12px" }}>
                {" "}(Đã chỉnh sửa)
              </Text>}
            </div>
          </div>
        </div>

        {/* Nút Cập nhật và Xóa, Xem lịch sử chỉnh sửa */}
        <Space>
          {(userId === getUid()) && <>
            <Tooltip title="Chỉnh sửa bài viết">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleUpdate}
                style={{ padding: 0 }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Xóa bài viết">
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                danger
                onClick={showDeleteConfirm}
                style={{ padding: 0 }}
                size="small"
              />
            </Tooltip>
          </>}
          {props.post.updated && <Tooltip title="Lịch sử chỉnh sửa">
            <Button
              type="default"
              icon={<HistoryOutlined />}
              onClick={handleViewHistory}
              style={{ padding: 0 }}
              size="small"
            />
          </Tooltip>}
        </Space>
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

      {/* Modal chỉnh sửa */}
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
        visible={isEditModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
        centered
        maskClosable={false}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
        }}
        okButtonProps={{
          size: 'large',
          style: { minWidth: 100 }
        }}
        cancelButtonProps={{
          size: 'large',
          style: { minWidth: 80 }
        }}
      >
        {isEditModalVisible && (
          <div style={{ height: '450px' }}>
            <ReactQuill
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
              preserveWhitespace={true} // Giữ nguyên khoảng trắng
            />
          </div>

        )}
      </Modal>

      {/* Modal lịch sử chỉnh sửa */}
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
        visible={isHistoryModalVisible}
        onCancel={() => {
          setIsHistoryModalVisible(false);
          setPostHistory([]); // Reset history khi đóng modal
        }}
        footer={null}
        width={800}
        centered
        maskClosable={true}
        bodyStyle={{
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'auto',
        }}
      >
        {loadingHistory ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <Timeline>
            {postHistory.map((history) => (
              <Timeline.Item key={history.id}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {history.elapsedTime}
                    </Text>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '14px'
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
    </div>
  );
});

export default Post;
