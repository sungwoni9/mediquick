package com.mediquick.web.primary.interpretation.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class InterpretationRequestDto {
    private Integer code;
    private String username;
    private int studykey;
    private int findingCode;
}
