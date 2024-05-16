package com.hansung.InsuranceProject.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "searchKeyWord")
public class SearchKeyWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long keyWordId;

    private String keyWord;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id")
    private Account account;

    public SearchKeyWord(String keyWord, Account account){
        this.keyWord = keyWord;
        this.account = account;
    }
}
