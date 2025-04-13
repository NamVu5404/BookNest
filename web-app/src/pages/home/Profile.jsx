import {Avatar, Card, Col, Image, Row, Typography} from "antd";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ReusablePostList from "../../components/ReusablePostList";
import {UserOutlined} from "@ant-design/icons";
import {getProfileByUid} from "../../services/profileService";
import {getUserPosts} from "../../services/postService";
import {useUserDetails} from "../../contexts/UserContext";

const {Text} = Typography;

export default function Profile() {
    const {userId} = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const {userDetails} = useUserDetails();
    const navigate = useNavigate();

    useEffect(() => {
        if (userId === userDetails?.userId) {
            navigate("/profile", {replace: true});
        }

        const fetchProfile = async () => {
            try {
                const response = await getProfileByUid(userId);
                setUserProfile(response.data.result);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId, navigate, userDetails]);

    const userPostsFetcher = () => getUserPosts(userId);

    return (
        <Row gutter={[16]}>
            {/* thông tin cá nhân */}
            <Col xl={10}>
                <Card
                    title={
                        <div>
                            Thông tin cá nhân
                        </div>
                    }
                    className="bg profile-sidebar"
                    styles={{
                        body: {padding: '24px'}
                    }}
                    loading={loading}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <div style={{marginBottom: '12px', position: 'relative'}}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {userProfile?.avatar ? (
                                    // <Avatar
                                    //   src={userProfile.avatar}
                                    //   size={120}
                                    //   style={{
                                    //     width: '100%',
                                    //     height: '100%',
                                    //     objectFit: 'cover'
                                    //   }}
                                    // />
                                    <Image
                                        src={userProfile.avatar}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        size={120}
                                        icon={<UserOutlined style={{fontSize: '48px'}}/>}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f5f5f5',
                                            border: '2px dashed #d9d9d9'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{borderTop: '1px solid #f0f0f0', paddingTop: '24px'}}>
                        <div style={{marginBottom: '16px'}}>
                            <Text type="secondary">Họ và tên</Text>
                            <div style={{fontSize: '16px', marginTop: '4px'}}>
                                {userProfile?.fullName || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{marginBottom: '16px'}}>
                                    <Text type="secondary">Số điện thoại</Text>
                                    <div style={{fontSize: '16px', marginTop: '4px'}}>
                                        {userProfile?.phoneNumber || 'Chưa cập nhật'}
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{marginBottom: '16px'}}>
                                    <Text type="secondary">Ngày sinh</Text>
                                    <div style={{fontSize: '16px', marginTop: '4px'}}>
                                        {userProfile?.dob ? dayjs(userProfile.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <div>
                            <Text type="secondary">Giới thiệu bản thân</Text>
                            <div style={{fontSize: '16px', marginTop: '4px', whiteSpace: 'pre-wrap'}}>
                                {userProfile?.bio || 'Chưa cập nhật'}
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>

            {/* bài viết */}
            <Col xl={14}>
                <ReusablePostList fetchFunction={userPostsFetcher} hidden={true}/>
            </Col>
        </Row>
    );
}