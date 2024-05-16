![header](https://capsule-render.vercel.app/api?type=waving&height=450&text=무엇이든%20물어보험&fontSize=50&%20&desc=PDF%20기반%20보험약관%20AI%20챗봇%20웹%20서비스&color=auto)
<br>
<div align="center">
  <b>HSU 2024 Capstone Project</b>
</div>
<br>

## 📌목차
* [개요](#개요)
* [핵심 기능](#핵심-기능)
* [기술 스택](#기술-스택)
* [시스템 구조도](#시스템-구조도)
* [주요 화면](#주요-화면)
* [팀 정보](#팀-정보)
## 📍개요
&nbsp;&nbsp;&nbsp;
오늘날, 보험 상품의 다양화와 복잡성 증가로 인해 많은 사용자들이 보험 약관의 내용을 정확히 이해하는 데 어려움을 겪고 있다. 이로 인해 사용자들이 보험 혜택을 완전히 활용하지 못하고 중요한 보장 내용을 놓칠 위험이 존재한다. 따라서 우리는 보험 계약서를 쉽게 조회하고, 관련 질문에 신속하게 답변할 수 있는 플랫폼의 필요성을 인식했다. 사용자가 선택한 보험 계약서와 연결된 채팅방에서 PDF 형식의 보험 약관과 상호작용하는 챗봇을 통해 질문할 수 있도록 하며, 이를 통해 보험 약관의 이해를 돕고, 관련 질문에 즉각적으로 대응한다. 또한, 중요한 정보는 핀 기능을 통해 저장하고 쉽게 찾아볼 수 있어 사용자 경험을 개선하고 보험 약관에 대한 접근성을 높인다.
## ✨핵심 기능
* 채팅방 생성
  * 사용자가 원하는 보험 약관을 선택합니다.
  * 채팅방 이름을 설정합니다.
  * 이후에 채팅방 이름을 수정할 수 있고 채팅방을 삭제할 수 있습니다.
* 챗봇 서비스
  * 사용자는 한 화면에서 PDF를 보면서 채팅을 할 수 있습니다.
  * 사용자는 보험에 관련된 궁금한 내용을 질문합니다.
  * 챗봇은 사용자가 선택한 PDF를 기반으로 답변을 보여줍니다.
* 질문 추천
  * 보험 약관의 유형별로 사용자들이 가장 많이 한 질문 3가지를 추천하여 채팅창에 표시합니다.
    * 채팅방 생성시 처음에만 추천됩니다.
  * 타 사용자의 질문을 기반으로 사용자가 한 질문과 비슷한 질문 3가지를 추천하여 표시합니다.
    * 질문을 남길때마다 매번 추천됩니다.
* 핀 기능
  * 채팅방에서 사용자는 원하는 답변을 핀 해놓을 수 있습니다.
  * 사용자는 핀 페이지에서 보험 약관 별로 핀 해놓은 답변을 한 번에 모아볼 수 있습니다.
* 검색 기능
  * 사용자는 키워드로 과거에 했던 질문을 검색할 수 있습니다.
  * 검색 시 질문과 답변 모두 확인할 수 있습니다.
## 📌기술 스택
<table>
  <tbody>
    <tr>
      <td>Language</td>
      <td>
        <img alt="Python" src ="https://img.shields.io/badge/Python-3776AB.svg?&style=for-the-badge&logo=Python&logoColor=white"/>
        <img alt="JavaScript" src ="https://img.shields.io/badge/JavaScript-F7DF1E.svg?&style=for-the-badge&logo=JavaScript&logoColor=black"/>
        <img alt="Java" src ="https://img.shields.io/badge/Java-1E8CBE.svg?&style=for-the-badge&logo=Java&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>Library & Framework</td>
      <td>
        <img alt="Spring Boot" src ="https://img.shields.io/badge/Spring Boot-6DB33F.svg?&style=for-the-badge&logo=Spring Boot&logoColor=white"/>
        <img alt="Spring Security" src ="https://img.shields.io/badge/Spring Security-6DB33F.svg?&style=for-the-badge&logo=Spring Security&logoColor=white"/>
        <img alt="React" src ="https://img.shields.io/badge/React-61DAFB.svg?&style=for-the-badge&logo=React&logoColor=black"/>
        <img alt="Flask" src ="https://img.shields.io/badge/Flask-000000.svg?&style=for-the-badge&logo=Flask&logoColor=white"/>
        <img alt="TensorFlow" src ="https://img.shields.io/badge/TensorFlow-FF6F00.svg?&style=for-the-badge&logo=TensorFlow&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>Database</td>
      <td>
        <img alt="MySQL" src ="https://img.shields.io/badge/MySQL-4479A1.svg?&style=for-the-badge&logo=MySQL&logoColor=white"/>
        <img alt="Chroma" src ="https://img.shields.io/badge/Chroma-FC521F.svg?&style=for-the-badge&logo=Chroma&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>Tool</td>
      <td>
        <img alt="IntelliJ IDEA" src ="https://img.shields.io/badge/IntelliJ IDEA-000000.svg?&style=for-the-badge&logo=IntelliJ IDEA&logoColor=white"/>
        <img alt="PyCharm" src ="https://img.shields.io/badge/PyCharm-000000.svg?&style=for-the-badge&logo=PyCharm&logoColor=white"/>
      </td>
    </tr>
  </tbody>
</table>

## 🖻시스템 구조도
![11조_이미지_주요 적용 기술 및 구조](https://github.com/yunh0/CapstoneDesign/assets/114940378/0426c4c9-a48a-41b5-9f26-5ad16c6375c0)

## 📸주요 화면
## 👩‍👩‍👧‍👦팀 정보
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/yunh0"><img src="https://github.com/yunh0/CapstoneDesign/assets/114940378/1c1f7176-71c5-4ade-8f75-ef13f88141fb" width="100px;" alt=""/><br /><sub><b>BE/AI 팀장 : 남윤호 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/jiiwons"><img src="https://github.com/yunh0/CapstoneDesign/assets/114940378/3d1cae53-a032-4674-9360-48226f0ba1a8" width="100px;" alt=""/><br /><sub><b>AI 팀원 : 서지원 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/twoallzero"><img src="https://github.com/yunh0/CapstoneDesign/assets/114940378/7dbac6bd-153f-42e7-9392-ea8cf749fc18" width="100px;" alt=""/><br /><sub><b>BE/FE 팀원 : 이다영 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/qnfRhczkfltmak12"><img src="https://github.com/yunh0/CapstoneDesign/assets/114940378/c9d05c28-5d41-4094-9851-c306d2ac6aa6" width="100px;" alt=""/><br /><sub><b>FE 팀원 : 이진욱 </b></sub></a><br /></td>
     <tr/>
  </tbody>
</table>
