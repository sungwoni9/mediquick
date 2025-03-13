<div align="center">

![LOGO](https://github.com/user-attachments/assets/62fc74c6-be67-43c3-9367-39dcca20af8b)

### 의료영상 표준 웹 뷰어 프로젝트 🖍️
![프로젝트 기간](https://img.shields.io/badge/프로젝트_기간-2025.02.11~2025.03.14-fab2ac?style=flat&logo=&logoColor=white&color=blue)
<br/>
![사용 언어 수](https://img.shields.io/github/languages/count/sungwoni9/mediquick?label=%EC%82%AC%EC%9A%A9%20%EC%96%B8%EC%96%B4%20%EC%88%98&color=green)
![커밋수](https://badgen.net/github/commits/sungwoni9/mediquick/develop?label=%EC%BB%A4%EB%B0%8B%EC%88%98&color=green)
![릴리즈](https://img.shields.io/badge/릴리즈-v1.0.0-1?style=flat&logo=google-chrome&logoColor=white)
<br/>
![Java 17](https://img.shields.io/badge/Java_17-white)
![JSP/JSTL](https://img.shields.io/badge/JSP/JSTL-white)
![HTML5](https://img.shields.io/badge/HTML5-white?logo=html5&ogoColor=E34F26)
![CSS](https://img.shields.io/badge/CSS-white?logo=css3&logoColor=1572B6)
![JavaScript](https://img.shields.io/badge/JavaScript-white?logo=javascript&logoColor=F7DF1E)
![Spring](https://img.shields.io/badge/Spring-white?logo=spring&logoColor=6DB33F)
![SpringBoot](https://img.shields.io/badge/SpringBoot-white?logo=springboot&logoColor=6DB33F)
![MySQL](https://img.shields.io/badge/MySQL-white?logo=mysql&logoColor=4479A1)
![AWS RDS](https://img.shields.io/badge/AWS_RDS-white?logo=amazonrds&logoColor=527FFF)
![Node.js](https://img.shields.io/badge/Node.js-white?logo=nodedotjs&logoColor=5FA04E)
![npm](https://img.shields.io/badge/npm-white?logo=npm&logoColor=CB3837)
![Webpack](https://img.shields.io/badge/Webpack-white?logo=webpack&logoColor=8DD6F9)
![Cornerstone JS](https://img.shields.io/badge/Cornerstone_JS-white)
![dcm4che](https://img.shields.io/badge/dcm4che-white)
![jcifs](https://img.shields.io/badge/jcifs-white)
![Figma](https://img.shields.io/badge/Figma-white?logo=figma&logoColor=#F24E1E)
![Intellij IDEA](https://img.shields.io/badge/Intellij_IDEA-white?logo=intellijidea&logoColor=000000)
![Git](https://img.shields.io/badge/Git-white?logo=git&logoColor=F05032)
![GitHub](https://img.shields.io/badge/GitHub-white?logo=github&logoColor=181717)

</div> 


## 📝 프로젝트 소개
의료영상 표준 DICOM API 연동 프로젝트 <br/>
MediQuick은 의료 영상 표준 DICOM API를 연동한 웹 뷰어 프로젝트로, <br/>
의료진과 관리자가 환자 정보, 영상 데이터, 판독 소견, 진료 내역을 관리하고 조회할 수 있는 서비스입니다. <br/>
Spring Security와 JWT를 활용한 보안 인증, Cornerstone JS를 사용한 DICOM 렌더링 기술을 적용하여 구현했습니다.

- 주요 기능: 로그인/회원 관리, 영상 조회 및 조작, 판독 소견 작성, 진료 내역 작성, 로그 관리
- 목표: 의료 현장에서 정확하고 효율적인 진료를 지원

<br/>

>#### 🚨 빌드 시 주의
>MediQuick 프로젝트는 **제공된 오라클 데이터베이스와 네트워크 스토리지(NAS) 주소**를 기반으로 설정 및 빌드가 진행됩니다.</br>
> 아래와 같은 상황에서 빌드에 어려움이 발생할 수 있으니, 실행 전 다음 사항을 반드시 확인하세요:
>- 프로젝트는 오라클 DB에 접근하여 데이터를 처리합니다.<br/>
   >  제공된 DB 주소, 사용자 계정, 비밀번호 등이 누락되거나 잘못된 경우 애플리케이션 실행이 불가능합니다.
>- 의료 영상 데이터(DICOM 파일)는 네트워크 스토리지에 저장되어 있으며,<br/>
   >  해당 주소가 유효하지 않거나 접근 권한이 없는 경우 영상 렌더링 및 조회 기능이 동작하지 않습니다.

<br/>

### 프로젝트 설계
|ERD|Prototype|
|:---:|:---:|
|<img src="https://github.com/user-attachments/assets/86a04b6a-2389-4f56-b04f-8cbb6f5eae55" width="450"/>|<img src="https://github.com/user-attachments/assets/ab4886b5-e8ab-495a-9065-b0b6d3584bdb" width="450"/>|
|MediQuick 데이터베이스 ERD|MediQuick 피그마 프로토타입|

|요구사항 정의서|테이블 정의서|
|:---:|:---:|
|<img src="https://github.com/user-attachments/assets/66781acf-88f1-44cc-9795-a263f1b59308" width="450"/>|<img src="https://github.com/user-attachments/assets/dc8d893d-3aa6-4adb-b6db-99604111f814" width="450"/>|
|[Google Sheets 요구사항 정의서](https://docs.google.com/spreadsheets/d/1AvJOkSIUwnnFd9uHGz644wMCefkAmMVV/edit?usp=sharing&ouid=116131386255283817773&rtpof=true&sd=true)|[Google Sheets 테이블 정의서](https://docs.google.com/spreadsheets/d/1_tvJvFedw2__coCm6LyZM1zzMcFbJS07/edit?usp=sharing&ouid=116131386255283817773&rtpof=true&sd=true)|

|인터페이스 정의서|WBS|
|:---:|:---:|
|<img src="https://github.com/user-attachments/assets/a51fb6ff-9442-478c-b5dd-74a4946fed1c" width="450"/>|<img src="https://github.com/user-attachments/assets/1599c512-7f2e-4b61-90cc-f3f889fe63e4" width="450"/>|
|[Google Sheets 인터페이스 정의서](https://docs.google.com/spreadsheets/d/1MbzzqHyIaFTf0S_ZJ2TZQsR8DOOki0-J/edit?usp=sharing&ouid=116131386255283817773&rtpof=true&sd=true)|[Google Sheets WBS](https://docs.google.com/spreadsheets/d/1uvL3-ZCZ-tnin0C-UYyn6hjx2AccJz6l/edit?usp=sharing&ouid=116131386255283817773&rtpof=true&sd=true)|

<br/>

### 프로젝트 화면구성
|로그인|
|:---:|
|<img src="https://github.com/user-attachments/assets/fe1ecb6f-71c0-4aa3-aa63-38077b90e8f7" width="450"/>|
|MediQuick은 의료 영상 프로젝트로,<br/>로그인을 진행한 후 사용자 역할에 따른 기능을 제공합니다.<br>Spring Security 활용 및 JWT 토큰을<br/>발행하여 인증을 관리합니다.|
|상세조회|
|:---:|
|<img src="https://github.com/user-attachments/assets/caf21f4c-f982-471f-bb80-c0fec6391a60" width="450"/>|
|로그인 후 표시되는 대시보드 페이지에서는<br/>검사별 판독 소견, 환자 정보, 진료 현황을<br/>한눈에 확인할 수 있습니다.|

|회원관리|
|:---:|
|<img src="https://github.com/user-attachments/assets/17bb8157-6d08-4228-a45c-118a40a536b6" width="450"/>|
|관리자 권한을 가진 사용자는<br/>회원 정보를 조회하고 관리할 수 있습니다.<br/>조회된 회원 목록은 10개 단위로<br/> 페이징 처리되어 표시됩니다.|

|영상조회|
|:---:|
|<img src="https://github.com/user-attachments/assets/7152ce90-aa23-467b-8234-e0e98153a7ab" width="450"/>|
|검사(Study)에 해당하는 시리즈 목록을 불러와<br/>DICOM 형식 파일을 렌더링하고 조작할 수 있습니다.<br/>파일에서 메타데이터를 추출하여 오버레이 형태로 제공합니다.|

|영상판독|
|:---:|
|<img src="https://github.com/user-attachments/assets/7862ad68-b1bc-4f06-aea6-24378477eebc" width="450"/>|
|'판독의' 역할을 부여받은 사용자는<br/>조회된 영상에 대한 판독 소견을 확인, 작성, 수정할 수 있습니다.|

|로그관리|
|:---:|
|<img src="https://github.com/user-attachments/assets/3a70da6e-c5a6-468c-a86c-07606a5123da" width="450"/>|
|관리자 권한을 가진 사용자는<br/>사용자별 로그인·로그아웃 기록 및 조회 내역을<br/>확인할 수 있으며, 필터링 기능을 통해<br/>원하는 정보를 쉽게 찾을 수 있습니다.|

<br/>

## ⚙ 기술 스택
### Front-end
<div>
<img src="https://github.com/user-attachments/assets/5caa5b35-314b-4d44-82c9-b9bc1b0d27cd" width="60">
<img src="https://github.com/user-attachments/assets/87ae75e5-bbf7-48e8-98ad-04da6e708a89" width="60">
<img src="https://github.com/user-attachments/assets/4a0f33c1-37d7-4b2b-9454-d13ec723fc72" width="60">
<img src="https://github.com/user-attachments/assets/76af8467-0cc6-4ab6-af5e-d995817b25d5" width="60">
<img src="https://github.com/user-attachments/assets/185c428c-2206-4014-944c-b6bb1f0c5c18" width="60">
<img src="https://github.com/user-attachments/assets/b0058543-d60d-45e8-a9eb-a5873c558b91" width="60">
<img src="https://github.com/user-attachments/assets/c082ba58-1f43-4f5f-abd6-dc9cb6208d8f" width="60">
<img src="https://github.com/user-attachments/assets/bf5cbb32-920c-4ff3-b213-4bb0112170b8" width="60">
<img src="https://github.com/user-attachments/assets/e90e70cc-fb4d-43f8-b4d0-e8f8813ba6f0" width="60">
</div>

### Back-end
<div>
<img src="https://github.com/user-attachments/assets/aed9f647-486a-4bde-b296-680a5c48937c" width="60">
<img src="https://github.com/user-attachments/assets/6fa87a9c-a159-4e25-815a-281d9969202b" width="60">
<img src="https://github.com/user-attachments/assets/66e05d43-7247-42aa-b6f7-a1fccd9e39a6" width="60">
<img src="https://github.com/user-attachments/assets/bc65ad72-8ddf-4145-802c-e1151cb482ea" width="60">
<img src="https://github.com/user-attachments/assets/92664f96-2f46-4402-b777-872356e041e4" width="60">
<img src="https://github.com/user-attachments/assets/a6942a4d-1daf-4da1-bff7-8b9a1fa45d56" width="60">
<img src="https://github.com/user-attachments/assets/574dfe5f-1db9-44ff-91ba-f2ebd4d8fdb8" width="60">
</div>

### Database
<div>
<img src="https://github.com/user-attachments/assets/a4f7d7d0-cf9f-434e-97ff-d2b9a020eb97" width="60">
<img src="https://github.com/user-attachments/assets/ea902b55-c6a2-4678-b9c5-e5295bc5aa3f" width="60">
<img src="https://github.com/user-attachments/assets/c544939e-38dd-4820-8b5c-4f7a6843ceab" width="60">
</div>

### Tool
<div>
<img src="https://github.com/user-attachments/assets/4b7bbf9a-6ab5-4756-95d9-a14300c465be" width="60">
<img src="https://github.com/user-attachments/assets/b5d225af-1363-427b-bec2-799da1535c29" width="60">
<img src="https://github.com/user-attachments/assets/4463e299-8d6a-40a8-8d91-263509d9feba" width="60">
</div>

<br />

## 💁‍♂️ 프로젝트 팀원
|                                           환자 정보 및 진료 기록                                           |                                              로그 및 보안                                              |
|:-------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------:|
| ![프로필1](https://github.com/user-attachments/assets/f850e168-a0f7-495f-a384-e48fd4d55e93?size=100) | ![프로필2](https://github.com/user-attachments/assets/88168d61-63b8-4b38-98e9-6047105a1e2d?size=100) |
|                                [허성원](https://github.com/sungwoni9)                                |                                 [이동현](https://github.com/ghj0595)                                 |

|                                          의료 영상 렌더링 및 조작                                           |                                          환자 판독 소견 기록 관리                                           |
|:-------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------:|
| ![프로필3](https://github.com/user-attachments/assets/b84e82b5-99d9-424f-a58b-05033a600bc6?size=100) | ![프로필4](https://github.com/user-attachments/assets/9b1df516-bfaa-4a46-9e51-5d34ca194dcd?size=100) |
|                                 [이선구](https://github.com/SG5143)                                  |                                 [오세린](https://github.com/ohserin)                                 |

|                                          사용자 관리 및 권한 설정                                           |
|:-------------------------------------------------------------------------------------------------:|
| ![프로필5](https://github.com/user-attachments/assets/721c8c20-d6b3-41c6-81bd-7aa70b0c42b0?size=100) |
|                                 [한중수](https://github.com/Khankw)                                  |

