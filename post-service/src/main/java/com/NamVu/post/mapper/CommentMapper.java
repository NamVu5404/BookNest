package com.NamVu.post.mapper;

import com.NamVu.post.dto.response.CommentEditHistoryResponse;
import com.NamVu.post.dto.response.CommentResponse;
import com.NamVu.post.entity.Comment;
import com.NamVu.post.entity.CommentEditHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "subComment", ignore = true)
    CommentResponse toCommentResponse(Comment comment);

    CommentEditHistoryResponse toCommentEditHistoryResponse(CommentEditHistory commentEditHistory, String elapsedTime);
}
