import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TinderService } from '../tinder.service';

const questions =
[
    {
        question: '1. What is your gender?',
        answers: [
            {value: 'Male' , checked: false, index: 0},
            {value: 'Female', checked: false, index: 1}
        ],
        multianswer: false,
    },
    {
        question: '2. What are you interested in?',
        answers: [
            {value: 'Boys' , checked: false, index: 0},
            {value: 'Girls' , checked: false, index: 1},
            {value: 'Both' , checked: false, index: 2},
        ],
        multianswer: false,
    },
    {
        question: '3. What is your strength?',
        answers: [
            {value: 'Intelligence' , checked: false, index: 0},
            {value: 'Charisma' , checked: false, index: 1},
            {value: 'Loyalty' , checked: false, index: 2},
            {value: 'Creativity' , checked: false, index: 3},
            {value: 'Physical Appearance' , checked: false, index: 4},
        ],
        multianswer: false,
    },
    {
        question: '4. Which one of the following would be a perfect holiday?',
        answers: [
            {value: 'At a fancy hotel on the beach' , checked: false, index: 0},
            {value: 'In a hut on a tropical island' , checked: false, index: 1},
            {value: 'At a cabin near a cozy fireplace, in the mountains' , checked: false, index: 2},
            {value: 'At a penthouse in a big city' , checked: false, index: 3},
            {value: 'At a farm, in the countryside' , checked: false, index: 4},
        ],
        multianswer: false,
    },
    {
        question: '5. What is most important in a relationship?',
        answers: [
            {value: 'Under 2 months' , checked: false, index: 0},
            {value: '2 - 6 months' , checked: false, index: 1},
            {value: '6 months - 1 year' , checked: false, index: 2},
            {value: '1 - 3 years' , checked: false, index: 3},
            {value: 'Over 3 years' , checked: false, index: 4},
        ],
        multianswer: false,
    },
    {
        question: '6. What is most important in a relationship? (choose 3 options)',
        answers: [
            {value: 'Flexibility' , checked: false, index: 0},
            {value: 'Financial Status' , checked: false, index: 1},
            {value: 'Communication' , checked: false, index: 2},
            {value: 'Trust' , checked: false, index: 3},
            {value: 'Cherishing your partner' , checked: false, index: 4},
            {value: 'Respect' , checked: false, index: 5},
            {value: 'Spending time together' , checked: false, index: 6},
            {value: 'Sex' , checked: false, index: 7},
            {value: 'Sexual chemistry' , checked: false, index: 8},
        ],
        multianswer: true,
    },
    {
        question: '7. What would you define as cheating?',
        answers: [
            {value: 'Kissing another person' , checked: false, index: 0},
            {value: 'Flirting with another person' , checked: false, index: 1},
            {value: 'Having intercourse with another person' , checked: false, index: 2},
            {value: 'Sexting with someone else' , checked: false, index: 3},
            {value: 'Sleeping in the same bed' , checked: false, index: 4},
        ],
        multianswer: false,
    },
    {
        question: '8. What are you looking for, in a partner? (choose 3 options)',
        answers: [
            {value: 'Looks' , checked: false, index: 0},
            {value: 'Money' , checked: false, index: 1},
            {value: 'Kindness' , checked: false, index: 2},
            {value: 'Deep eyes' , checked: false, index: 3},
            {value: 'Smile' , checked: false, index: 4},
            {value: 'Ass' , checked: false, index: 5},
            {value: 'Boobs' , checked: false, index: 6},
            {value: 'Friendship' , checked: false, index: 7},
            {value: 'Being good in bed' , checked: false, index: 8},
        ],
        multianswer: true,
    },
    {
        question: '9. Which of the following do you consider an aphrodisiac?',
        answers: [
            {value: 'Chocolate covered strawberries' , checked: false, index: 0},
            {value: 'Whipped cream' , checked: false, index: 0},
            {value: 'Hot chillis' , checked: false, index: 0},
            {value: 'Bananas' , checked: false, index: 0},
            {value: 'Red Wine' , checked: false, index: 0},
        ],
        multianswer: false,
    },
    {
        question: '10. What is your favourite sex position?',
        answers: [
            {value: 'Missionary' , checked: false, index: 0},
            {value: '69' , checked: false, index: 0},
            {value: 'Reverse cowgirl' , checked: false, index: 0},
            {value: 'Spoon' , checked: false, index: 0},
            {value: 'The hot seat' , checked: false, index: 0},
        ],
        multianswer: false,
    },
    {
        question: '11. How many children would you want to have?',
        answers: [
            {value: '0' , checked: false, index: 0},
            {value: '1' , checked: false, index: 0},
            {value: '2' , checked: false, index: 0},
            {value: '3+' , checked: false, index: 0},
            {value: '3 cats/dogs' , checked: false, index: 0},
        ],
        multianswer: false,
    }
];


@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
    
    questions = questions;
    
    constructor(private _tinderService: TinderService) { }
    
    ngOnInit() {
    }
    
    public SaveAnswers(form: NgForm) {
        const answers = [];
        let i = 0;
        questions.forEach(q => {
            if (q.multianswer === true) {
                var res = q.answers.filter(a => a.checked !== false).map(a => a.index).join();
                answers.push(res);
            } else {
                answers.push(form.value[i]);
            }
            i++;
        });
        this._tinderService.saveAnswers(answers);
    }
}
