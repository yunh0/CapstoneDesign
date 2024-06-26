package com.hansung.InsuranceProject.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hansung.InsuranceProject.constant.MessageType;
import com.hansung.InsuranceProject.dto.MessageDto;
import com.hansung.InsuranceProject.entity.Message;
import com.hansung.InsuranceProject.request.MessageRequest;
import com.hansung.InsuranceProject.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/user/message/{chatroomId}")
    public ResponseEntity saveMessageAndReturnAiMessage(@PathVariable Long chatroomId, @RequestBody MessageRequest request){
        String flaskResponse = sendQuestionToFlask(request.getContent());
        ObjectMapper objectMapper = new ObjectMapper();

        try{
            JsonNode jsonResponse = objectMapper.readTree(flaskResponse);
            String messageReceived = jsonResponse.get("message").asText();
            String predictionReceived = jsonResponse.get("prediction").asText();
            System.out.println("Flask server response: " + messageReceived);
            System.out.println("Flask server response: " + predictionReceived);
            Message userMessage = messageService.saveMessage(chatroomId, MessageType.PERSON, request.getContent(), predictionReceived);
            Message aiMessage = messageService.saveMessage(chatroomId, MessageType.AI, messageReceived, null);
            MessageDto messageDto = MessageDto.convertToDto(aiMessage);

            return ResponseEntity.ok().body(messageDto);
        }
        catch (IOException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String sendQuestionToFlask(String content){
        String flaskServerUrl = "http://localhost:5000/api/message/receive";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> data = new HashMap<>();
        data.put("content", content);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(data, headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> responseEntity = restTemplate.postForEntity(flaskServerUrl, requestEntity, String.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            System.out.println("메시지를 Flask 서버로 성공적으로 전송했습니다");
            return responseEntity.getBody();
        } else {
            System.err.println("Flask 서버로 메시지를 보내는 데 실패했습니다. 응답 코드: " + responseEntity.getStatusCodeValue());
            return null;
        }
    }
}