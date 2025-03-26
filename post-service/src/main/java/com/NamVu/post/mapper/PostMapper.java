package com.NamVu.post.mapper;

import com.NamVu.post.dto.response.PostResponse;
import com.NamVu.post.entity.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostResponse toPostResponse(Post post);
}
