import {message, Modal} from "antd";
import DOMPurify from 'dompurify';
import React, {useRef, useState} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {createPost} from "../services/postService";

const CreatePost = ({visible, onClose}) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const quillRef = useRef(null);

    const modules = {
        toolbar: [
            [{'header': [1, 2, 3, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'align': []}],
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

    const handleSave = async () => {
        setLoading(true);
        try {
            const cleanContent = content.replace(/<p><br><\/p>/g, '').trim();
            if (!cleanContent) {
                message.error("Nội dung không được để trống!");
                return;
            }

            const sanitizedContent = DOMPurify.sanitize(cleanContent, purifyConfig);
            await createPost({content: sanitizedContent});

            message.success("Đăng bài viết thành công!");
            setContent('');
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || "Đăng bài viết thất bại!");
            console.error("Lỗi khi đăng bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setContent('');
        onClose();
    };

    return (
        <Modal
            title={
                <div style={{
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '18px',
                    fontWeight: 600,
                }}>
                    Tạo bài viết mới
                </div>
            }
            open={visible}
            onOk={handleSave}
            onCancel={handleCancel}
            okText="Đăng"
            cancelText="Hủy"
            width={800}
            centered
            maskClosable={false}
            style={{top: 20}}
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 200px)',
                    overflow: 'auto',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                }
            }}
            okButtonProps={{
                size: 'large',
                style: {minWidth: 100},
                loading: loading
            }}
            cancelButtonProps={{
                size: 'large',
                style: {minWidth: 80}
            }}
        >
            <div style={{height: '450px'}}>
                <div className="quill-editor">
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
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
        </Modal>
    );
};

export default CreatePost;