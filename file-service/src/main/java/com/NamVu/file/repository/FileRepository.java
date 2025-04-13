package com.NamVu.file.repository;

import com.NamVu.file.dto.response.FileInfo;
import com.NamVu.file.entity.FileManagement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Repository
public class FileRepository {
    @Value("${app.file.storage-dir}")
    String storageDir;

    @Value("${app.file.urlPrefix}")
    String urlPrefix;

    /**
     * Lưu tệp tải lên vào vào thư mục đã chỉ định
     *
     * @param file Tệp tải lên
     * @return FileInfo chứa thông tin về tệp đã lưu
     * @throws IOException Nếu có lỗi xảy ra trong quá trình lưu trữ tệp
     */
    public FileInfo store(MultipartFile file, String subDir) throws IOException {
        // Thiết lập đường dẫn lưu trữ tệp với subdirectory
        // .normalize() sẽ loại bỏ các phần tử không hợp lệ trong đường dẫn
        // .toAbsolutePath() sẽ chuyển đổi đường dẫn tương đối thành đường dẫn tuyệt đối
        Path folder = Paths.get(storageDir, subDir).normalize().toAbsolutePath();

        // Tạo thư mục mới nếu chưa tồn tại
        if (!Files.exists(folder)) {
            Files.createDirectories(folder);
        }

        // Lấy extension của tệp tải lên
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());

        // Tạo tên tệp ngẫu nhiên với định dạng UUID và extension (nếu có)
        String fileName = Objects.isNull(fileExtension)
                ? UUID.randomUUID().toString()
                : UUID.randomUUID() + "." + fileExtension;

        // .resolve() tạo đường dẫn đầy đủ tệp
        Path filePath = folder.resolve(fileName);

        // Sao chép nội dung của tệp vào đường dẫn đã chỉ định, nếu tồn tại thì thay thế
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return FileInfo.builder()
                .name(fileName)
                .contentType(file.getContentType())
                .size(file.getSize())
                .md5Checksum(DigestUtils.md5DigestAsHex(file.getInputStream()))
                .path(filePath.toString())
                .url(urlPrefix + fileName)
                .build();
    }

    /**
     * Đọc tệp từ thư mục đã chỉ định
     *
     * @param fileManagement Đối tượng FileManagement chứa thông tin về tệp
     * @return Resource chứa nội dung tệp
     * @throws IOException Nếu có lỗi xảy ra trong quá trình đọc tệp
     */
    public Resource read(FileManagement fileManagement) throws IOException {
        Path path = Path.of(fileManagement.getPath());
        return new InputStreamResource(Files.newInputStream(path));
    }
}
