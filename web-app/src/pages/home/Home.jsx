import {Breadcrumb} from "antd";
import ReusablePostList from "../../components/ReusablePostList";
import {getAllPosts} from "../../services/postService";

export default function Home() {
    return (
        <>
            <Breadcrumb
                style={{marginBottom: 16}}
                items={[{title: "Trang chủ"}]}
            />

            <ReusablePostList fetchFunction={getAllPosts}/>
        </>
    );
}
