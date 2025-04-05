import {Col, Row} from "antd";
import ReusablePostList from "../../components/ReusablePostList";
import {getAllPosts} from "../../services/postService";
import RightSidebar from "../../components/RightSidebar";

export default function Home() {
    return (
        <>
            <Row gutter={[24]}>
                <Col xl={16}><ReusablePostList fetchFunction={getAllPosts}/></Col>
                <Col xl={8}>
                    <RightSidebar/>
                </Col>
            </Row>
        </>
    );
}
