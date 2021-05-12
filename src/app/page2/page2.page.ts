import { Component, OnInit } from '@angular/core';
//import { randomBytes } from 'crypto';
import {TriviaService} from '../Services/trivia.service';
import {Storage} from '@ionic/storage-angular';
@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
})
export class Page2Page implements OnInit {
  
questionData :any = [];
  constructor(private triviaService:TriviaService, private storage:Storage) { }
  difficulty:String;
  Category:String;
  Question:String;
  correctAnswer:String;
  disableButtons:boolean;
  hideResults:boolean;
  message:String;
  answered:boolean = false;
  possibleAnswers:any = [];
  totalCorrect:number;
  totalAnswers:number;
  totalIncorrect:number;
 
  ngOnInit() {
    //creating storage, initialising the counters if storage is empty, and grabbing the values from storage otherwise
     this.storage.create();
    if(this.storage.get('total')== undefined)
    {
      this.totalAnswers = 0;
      this.totalCorrect = 0;
      this.totalIncorrect = 0;
    }
    else
    {
      this.storage.get('total')
      .then((data)=>{
        this.totalAnswers=data;
      })
      this.storage.get('correct')
      .then((data)=>{
        this.totalCorrect=data;
      })
      this.storage.get('incorrect')
      .then((data)=>{
        this.totalIncorrect=data;
      })
    }
    this.triviaService.GetQuestion().subscribe(
      (data)=>{
        this.questionData = data;
        console.log(this.questionData);
        //grabbing data from the trivia API, with the "replace all" function cleaning up the question
          this.Category = this.questionData.results[0].category;
          this.Question = this.questionData.results[0].question.replaceAll("&quot;"," ").replaceAll("&#039;", "'");
          this.difficulty = this.questionData.results[0].difficulty;
          this.correctAnswer = this.questionData.results[0].correct_answer;
        //if the question type is 4 option multiple choice, it randomises answer position, beginning with the correct one
        if(this.questionData.results[0].type == "multiple")
        {
          this.possibleAnswers[this.triviaService.getRandomInt(4)] = this.questionData.results[0].correct_answer;
           let allowContinue = false;
          for(var i=0;i<3;i++)
          {
            //verbose code that forces it to generate a new random number until it finds an empty position
            allowContinue = false;
            while(allowContinue == false)
            {
              let position = this.triviaService.getRandomInt(4);
              console.log(position)
              if(this.possibleAnswers[position] == undefined)
              {
              this.possibleAnswers[position] = this.questionData.results[0].incorrect_answers[i];
              allowContinue = true;
              }
              else
              {
                position = this.triviaService.getRandomInt(4);
              }
            }
          }
          console.log(this.questionData.results[0].correct_answer);
          console.log(this.possibleAnswers);
        }
        //for true/false questions, I could hardcode the button values, and make the extra two buttons disappear
        else{
        this.possibleAnswers.push("True","False");

        this.disableButtons = true;
         
        }
      }
    );
    
  }
  SubmitAnswer(answer:String) {
    console.log(answer);
    if(this.answered==false)
    {
      //compares submitted answer to the correct one, adding to the correct counter, and displaying a message if correct, and the same for incorrect answers
      //adds to total answer counter regardless, and updates the values in storage
      if(answer == this.questionData.results[0].correct_answer)
      {
        console.log("Correct!");
        this.message = "Correct!";
        this.totalCorrect++;
        this.storage.set("correct",this.totalCorrect);
      }
      else
      {
        console.log("Wrong!");
        this.message = "Incorrect!";
        this.totalIncorrect++;
        this.storage.set("incorrect",this.totalIncorrect);
      }
      this.answered = true;
      this.hideResults = false;
      this.totalAnswers++;
      this.storage.set("total",this.totalAnswers);
   }
  }
}
