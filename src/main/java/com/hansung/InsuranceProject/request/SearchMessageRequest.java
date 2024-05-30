package com.hansung.InsuranceProject.request;

import lombok.Data;

@Data
public class SearchMessageRequest {

    private String content;
    private String type; // 추가된 필드

    // Getter와 Setter
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
