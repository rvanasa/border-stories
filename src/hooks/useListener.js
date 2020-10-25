import {useEffect} from 'react';

export default function useListener(target, event, listener, options) {

    let domTarget = target.hasOwnProperty('addEventListener');

    useEffect(() => {
        if(domTarget) {
            target.addEventListener(event, listener, options);
        }
        else {
            target.addListener(event, listener, options);
        }
        return () => {
            if(domTarget) {
                target.removeEventListener(event, listener);
            }
            else {
                target.removeListener(event, listener);
            }
        };
    });

    return listener;
}
