import {UserOutlined} from "@ant-design/icons";
import {Avatar, Button, Card, Col, DatePicker, Form, Input, message, Row, Upload} from "antd";
import dayjs from "dayjs";
import React, {useCallback, useEffect, useState} from "react";
import ReusablePostList from "../../components/ReusablePostList";
import {useUserDetails} from "../../contexts/UserContext";
import {getUid} from "../../services/localStorageService";
import {getMyPosts} from "../../services/postService";
import {updateProfile} from "../../services/profileService";

export default function Profile() {
    const {userDetails} = useUserDetails();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(userDetails?.avatar || null);

    const myPostsFetcher = useCallback(() => getMyPosts(), []);

    // Populate form with user details when component mounts
    useEffect(() => {
        if (userDetails) {
            form.setFieldsValue({
                fullName: userDetails.fullName,
                phoneNumber: userDetails.phoneNumber,
                bio: userDetails.bio,
                // Convert date string to dayjs object for DatePicker
                dob: userDetails.dob ? dayjs(userDetails.dob) : null,
            });
            setImageUrl(userDetails.avatar);
        }
    }, [userDetails, form]);

    // Handle form submission
    const onFinish = (values) => {
        setLoading(true);
        try {
            // Convert dayjs object to string for API
            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
                avatar: imageUrl,
            };

            // Kiểm tra thay đổi
            const hasChanged =
                formattedValues.fullName !== userDetails.fullName ||
                formattedValues.phoneNumber !== userDetails.phoneNumber ||
                formattedValues.bio !== userDetails.bio ||
                formattedValues.dob !== userDetails.dob ||
                formattedValues.avatar !== userDetails.avatar;

            if (!hasChanged) {
                setLoading(false);
                return;
            }

            setTimeout(async () => {
                try {
                    await updateProfile(getUid(), {
                        userId: getUid(),
                        ...formattedValues,
                    });
                    message.success("Cập nhật thông tin thành công!");
                    setLoading(false);
                } catch (error) {
                    console.error("Failed to update profile:", error);
                    message.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
                    setLoading(false);
                }
            }, 500);
        } catch (error) {
            console.error("Failed to update profile:", error);
            message.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
            setLoading(false);
        }
    };

    // Upload avatar handling
    // const handleAvatarChange = (info) => {
    //   if (info.file.status === "uploading") {
    //     return;
    //   }

    //   if (info.file.status === "done") {
    //     // When using actual API, this would be replaced with the response URL
    //     // For now, simulating a successful upload
    //     const imageUrl = URL.createObjectURL(info.file.originFileObj);
    //     setImageUrl(imageUrl);
    //     message.success("Tải ảnh lên thành công!");
    //   } else if (info.file.status === "error") {
    //     message.error("Tải ảnh thất bại.");
    //   }
    // };

    // Validate date of birth (3-80 years old)
    const validateDob = (_, value) => {
        if (!value) {
            return Promise.resolve();
        }

        const today = new Date();
        const birthDate = value.toDate();

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (age < 3) {
            return Promise.reject("Tuổi phải lớn hơn hoặc bằng 3!");
        }

        if (age > 80) {
            return Promise.reject("Tuổi phải nhỏ hơn hoặc bằng 80!");
        }

        return Promise.resolve();
    };

    const handleCancel = () => {
        form.resetFields();
    };

    return (
        <>
            <Row gutter={[16]}>
                {/* thông tin cá nhân */}
                <Col xl={10}>
                    <Card title="Thông tin cá nhân" className="bg profile-sidebar">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                fullName: userDetails?.fullName || "",
                                phoneNumber: userDetails?.phoneNumber || "",
                                bio: userDetails?.bio || "",
                                dob: userDetails?.dob ? dayjs(userDetails.dob) : null,
                            }}
                        >
                            <Row gutter={[16]}>
                                <Col xl={6}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                    >
                                        {imageUrl ? (
                                            <Avatar size={100} src={imageUrl} alt="avatar"/>
                                        ) : (
                                            <Avatar size={100} icon={<UserOutlined/>}/>
                                        )}
                                    </Upload>
                                    <div style={{marginTop: 8}}>Ảnh đại diện</div>
                                </Col>
                                <Col xl={18}>
                                    <Row gutter={[16]}>
                                        <Col xl={24}>
                                            <Form.Item
                                                label="Họ và tên"
                                                name="fullName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Vui lòng nhập họ và tên!",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Nguyễn Văn A" maxLength={50}/>
                                            </Form.Item>
                                        </Col>

                                        <Col xl={12}>
                                            <Form.Item
                                                label="Số điện thoại"
                                                name="phoneNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                        pattern: /^0\d{9}$/,
                                                        message: "Số điện thoại không hợp lệ",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="0123456789"/>
                                            </Form.Item>
                                        </Col>
                                        <Col xl={12}>
                                            <Form.Item
                                                label="Ngày sinh"
                                                name="dob"
                                                rules={[{validator: validateDob}]}
                                            >
                                                <DatePicker
                                                    style={{width: "100%"}}
                                                    placeholder="09/09/1999"
                                                    format="DD/MM/YYYY"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Form.Item label="Giới thiệu bản thân" name="bio">
                                <Input.TextArea
                                    rows={4}
                                    maxLength={255}
                                    showCount
                                    placeholder="Viết vài dòng giới thiệu về bản thân ..."
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button style={{marginRight: 16}} onClick={handleCancel}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Cập nhật thông tin
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* bài viết */}
                <Col xl={14}>
                    <ReusablePostList fetchFunction={myPostsFetcher}/>
                </Col>
            </Row>
        </>
    );
}
