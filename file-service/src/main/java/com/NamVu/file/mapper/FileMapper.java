package com.NamVu.file.mapper;

import com.NamVu.file.dto.response.FileInfo;
import com.NamVu.file.entity.FileManagement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileMapper {
    @Mapping(target = "id", source = "name")
    FileManagement toFileManagement(FileInfo fileInfo);
}
