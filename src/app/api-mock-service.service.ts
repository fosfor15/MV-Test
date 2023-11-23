import { Injectable } from '@angular/core';
import { Observable, mergeMap, of, timer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiMockServiceService {

    /** Метод имитации отправки данных на сервер с получением успешного ответа или ошибки с равной вероятностью 50% */
    postName$(): Observable<boolean> {
        return timer(1e3)
            .pipe(
                mergeMap(() =>
                    of(Math.random() >= .5)
                )
            );
    }

}
