import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TinderService } from '../tinder.service';
import { AccountService } from 'src/app/account.service';

const questions =
[
    {
        question: '1. Ce esti tu?',
        value: 0,
        answers: [
            {value: 'Barbat' , checked: false, index: 0, score: 0},
            {value: 'Baietel' , checked: false, index: 0, score: 0},
            {value: 'Femeie', checked: false, index: 1, score: 1000000000},
            {value: 'Fetita', checked: false, index: 1, score: 1000000000}
        ],
        priority: 1,
        multianswer: false,
    },
    {
        question: '2. Care este punctul tau forte?',
        value: 0,
        answers: [
            {value: 'Inteligenta' , checked: false, index: 0, score: 2},
            {value: 'Carisma' , checked: false, index: 1, score: 3},
            {value: 'Loialitatea' , checked: false, index: 2, score: 1},
            {value: 'Creativitatea' , checked: false, index: 3, score: 1},
            {value: 'Aspect fizic' , checked: false, index: 4, score: 6},
            {value: 'Ma epilez pe picioare' , checked: false, index: 5, score: -3},
        ],
        priority: 2,
        multianswer: false,
    },
    {
        question: '3. Cati copii vrei?',
        value: 0,
        answers: [
            {value: '0' , checked: false, index: 0, score: 0},
            {value: '1' , checked: false, index: 1, score: 1},
            {value: '2' , checked: false, index: 2, score: 2},
            {value: '3+' , checked: false, index: 3, score: 3},
            {value: '3 pisici/caini' , checked: false, index: 4, score: 6},
        ],
        priority: 3,
        multianswer: false,
    },
    {
        question: '4. Care din urmatoarele constituie vacanta perfecta?',
        value: 0,
        answers: [
            {value: 'La un hotel scump pe plaja' , checked: false, index: 0, score: 2},
            {value: 'Intr-o cabana pe o insula tropicala' , checked: false, index: 1, score: 3},
            {value: 'La o cabana cu semineu in munti' , checked: false, index: 2, score: 1},
            {value: 'Intr-un penthouse dintr-un oras mare' , checked: false, index: 3, score: 4},
            {value: 'La ferma' , checked: false, index: 4, score: 5},
        ],
        priority: 4,
        multianswer: false,
    },
    {
        question: '5. Ce este cel mai important intr-o relatie?',
        value: 0,
        answers: [
            {value: 'Statutul financiar' , checked: false, index: 0, score: 6},
            {value: 'Comunicarea' , checked: false, index: 1, score: 3},
            {value: 'Increderea' , checked: false, index: 2, score: 4},
            {value: 'Incurajarea partenerului(in pat)' , checked: false, index: 3, score: 1},
            {value: 'Respectul' , checked: false, index: 4, score: 2},
            {value: 'Timpul petrecut impreuna' , checked: false, index: 5, score: 5},
            {value: 'Sexul' , checked: false, index: 6, score: 7},
            {value: 'Socrii' , checked: false, index: 7, score: 9},
        ],
        priority: 7,
        multianswer: false,
    },
    {
        question: '6. Cea mai lunga relatie?',
        value: 0,
        answers: [
            {value: 'Sub 2 luni' , checked: false, index: 0, score: 4},
            {value: '2 - 6 luni' , checked: false, index: 1, score: 2},
            {value: '6 - 12 luni' , checked: false, index: 2, score: 3},
            {value: '1 - 3 ani' , checked: false, index: 3, score: 1},
            {value: 'Peste 3 ani' , checked: false, index: 4, score: 3},
            {value: 'Caut relatie' , checked: false, index: 5, score: 6},
        ],
        priority: 6,
        multianswer: false,
    },
    {
        question: '7. Ce intelegi prin inselat?',
        value: 0,
        answers: [
            {value: 'Sarut cu alta persoana' , checked: false, index: 0, score: 1},
            {value: 'Flirtarea cu altcineva' , checked: false, index: 1, score: 1},
            {value: 'Sex cu alta persoana' , checked: false, index: 2, score: 3},
            {value: 'Dormitul in pat cu altcineva' , checked: false, index: 3, score: 1},
            {value: 'Sa manance usturoi la intalnire' , checked: false, index: 4, score: 4},
        ],
        priority: 7,
        multianswer: false,
    },
    {
        question: '8. Daca ai fi clonat, ai face sex cu tine?',
        value: 0,
        answers: [
            {value: 'Da' , checked: false, index: 0, score: 1},
            {value: 'Nu' , checked: false, index: 1, score: 2},
            {value: 'Sunt urat/a' , checked: false, index: 2, score: 3},
        ],
        priority: 5,
        multianswer: false,
    },
    {
        question: '9. Ce consideri a fi un afrodisiac pentru tine?',
        value: 0,
        answers: [
            {value: 'Capsuni invelite in ciocolata' , checked: false, index: 0, score: 1},
            {value: 'Praz' , checked: false, index: 1, score: -1},
            {value: 'Ardei iute' , checked: false, index: 2, score: 2},
            {value: 'Banana' , checked: false, index: 3, score: 4},
            {value: 'Vinul rosu' , checked: false, index: 4, score: 3},
        ],
        priority: 6,
        multianswer: false,
    },
    {
        question: '10.Ce apreciezi la o persoana(partener)? (alege cel putin 3 optiuni)',
        value: 0,
        answers: [
            {value: 'Aspectul' , checked: false, index: 0, score: 2},
            {value: 'Banii' , checked: false, index: 1, score: 1},
            {value: 'Se spala pe dinti' , checked: false, index: 2, score: 6},
            {value: 'Ochii' , checked: false, index: 3, score: 0},
            {value: 'Zambetul' , checked: false, index: 4, score: 0},
            {value: 'Curul' , checked: false, index: 5, score: 3},
            {value: 'Sanii' , checked: false, index: 6, score: 3},
            {value: 'Sora/fratele partenerului' , checked: false, index: 7, score: 5},
            {value: 'Animal in pat' , checked: false, index: 8, score: 4},
        ], 
        priority: 8,
        multianswer: true,
    }, 
    {
        question: '11. Cat timp a trecut de la ultima relatie?',
        value: 0,
        answers: [
            {value: 'Sub o saptamana' , checked: false, index: 0, score: 2},
            {value: '1 luna' , checked: false, index: 1, score: 0},
            {value: 'Cateva luni' , checked: false, index: 2, score: 1},
            {value: 'Mai mult de un an' , checked: false, index: 3, score: 2},
            {value: 'Virgin/virgina' , checked: false, index: 4, score: 3},
            {value: 'Sunt intr-o relatie, dar pot mai mult' , checked: false, index: 4, score: 7},
        ], 
        priority: 9,
        multianswer: false,
    },
    {
        question: '12. Ce cauti in seara asta?',
        value: 0,
        answers: [
            {value: 'Sa cunosc persoane noi' , checked: false, index: 0, score: 0},
            {value: 'Aventura de o noapte' , checked: false, index: 1, score: 4},
            {value: 'Sa impart pretul la uber la doi' , checked: false, index: 2, score: 3},
            {value: 'Amic de baut' , checked: false, index: 3, score: 2},
        ], 
        priority: 10,
        multianswer: false,
    },
    {
        question: '13. Care este pozitia preferata?',
        value: 0,
        answers: [
            {value: 'Misionarul' , checked: false, index: 0, score: 1},
            {value: '69' , checked: false, index: 1, score: 2},
            {value: 'Vacarita(cowgirl)' , checked: false, index: 2, score: 2},
            {value: 'Vacarita inversa(reverse cowgirl)' , checked: false, index: 3, score: 3},
            {value: 'Capra(doggystyle)' , checked: false, index: 4, score: 4},
        ], 
        priority: 10,
        multianswer: false,
    },
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
        let score = 0;
        questions.forEach(q => {
            if (q.multianswer === true) {
                var res = q.answers.filter(a => a.checked !== false);
                res.forEach(a => score += a.score*q.priority);
                var ans = res.map(a => a.index).join();
                answers.push(ans);
            } else {
                score += q.answers[form.value[i]].score * q.priority;
                answers.push(form.value[i]);
            }
            i++;
        });
        this._tinderService.saveAnswers(answers, score);
    }
}
