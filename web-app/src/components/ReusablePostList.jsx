/* eslint-disable react-hooks/exhaustive-deps */
// components/ReusablePostList.js
import {List, Spin} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import Post from "./Post";

const ReusablePostList = ({fetchFunction}) => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const lastPostElementRef = useRef();
    const hasLoadedInitial = useRef(false);

    const loadPosts = useCallback(
        (pageNum) => {
            console.log(`[LoadPosts] Fetching page: ${pageNum}`);
            setLoading(true);
            fetchFunction(pageNum)
                .then((response) => {
                    const newPosts = response.data.result.data || [];
                    const newTotalPages = response.data.result.totalPages || 0;
                    console.log(
                        `[LoadPosts] Success - Page: ${pageNum}, New posts: ${newPosts.length}, Total pages: ${newTotalPages}`
                    );
                    setTotalPages(newTotalPages);
                    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                    setHasMore(pageNum < newTotalPages);
                })
                .catch((error) => {
                    console.error(`[LoadPosts] Error fetching page ${pageNum}:`, error);
                    setHasMore(false);
                })
                .finally(() => {
                    console.log(`[LoadPosts] Loading finished for page: ${pageNum}`);
                    setLoading(false);
                });
        },
        [fetchFunction]
    );

    useEffect(() => {
        if (!hasLoadedInitial.current) {
            console.log(`[useEffect] Initial load for page: ${page}`);
            loadPosts(page);
            hasLoadedInitial.current = true;
        } else if (hasMore && !loading) {
            console.log(`[useEffect] Triggering loadPosts for page: ${page}`);
            loadPosts(page);
        }
    }, [page, loadPosts, hasMore]);

    // Debounce function để giới hạn tần suất gọi
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Xử lý sự kiện scroll
    const handleScroll = useCallback(
        debounce(() => {
            if (loading || !hasMore || !lastPostElementRef.current) {
                console.log(
                    `[Scroll] Skipped - loading: ${loading}, hasMore: ${hasMore}, ref: ${!!lastPostElementRef.current}`
                );
                return;
            }

            const lastElement = lastPostElementRef.current;
            const rect = lastElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            console.log(
                `[Scroll] Checking - top: ${rect.top}, bottom: ${rect.bottom}, windowHeight: ${windowHeight}`
            );

            // Kiểm tra nếu phần tử cuối gần đáy viewport (cách 200px)
            if (rect.bottom <= windowHeight + 200 && page < totalPages) {
                console.log(`[Scroll] Loading next page: ${page + 1}`);
                setPage((prevPage) => prevPage + 1);
            } else if (page >= totalPages) {
                console.log("[Scroll] No more pages to load");
            }
        }, 100), // Debounce 100ms
        [loading, hasMore, page, totalPages]
    );

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            <List
                dataSource={posts}
                itemLayout="vertical"
                renderItem={(post, index) =>
                    posts.length === index + 1 ? (
                        <List.Item
                            style={{
                                marginBottom: 12,
                                padding: 16,
                                background: "#fff",
                                borderRadius: 8,
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <div
                                ref={lastPostElementRef}
                                style={{minHeight: "50px", width: "100%"}}
                            >
                                <Post post={post}/>
                            </div>
                        </List.Item>
                    ) : (
                        <List.Item
                            style={{
                                marginBottom: 12,
                                padding: 16,
                                background: "#fff",
                                borderRadius: 8,
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <Post post={post}/>
                        </List.Item>
                    )
                }
            />
            {loading && (
                <div style={{textAlign: "center", padding: "16px"}}>
                    <Spin size="small"/>
                </div>
            )}
        </>
    );
};

export default ReusablePostList;
