//"text_boardC": "<p>Po śmierci można oddać nie tylko serce, wątrobę czy płuca, ale także tkanki takie jak rogówki, kości, zastawki serca. Jedna zmarła osoba może uratować życie nawet sześciu chorym, a pomóc w powrocie do zdrowia - kilkunastu.</p><a href = 'https://zgodanazycie.pl/wp-content/uploads/2020/01/karta_swiadectwo_woli_druk.pdf' class = 'clickable'  target='_blank'><b> Pobierz</b></a> wydrukuj i wypełnij świadectwo woli oddania po śmierci tkanek i narządów do przeszczepienia. Noś je przy sobie. Porozmawiaj z bliskimi, aby znali <b>Twoją wolę w decydującej chwili.</b><p>"
        

import { Vector3 } from "three";
import { Euler } from "three";

export default class GlHelper {


    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     */
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     * The value is no lower than min (or the next integer greater than min
     * if min isn't an integer) and no greater than max (or the next integer
     * lower than max if max isn't an integer).
     * Using Math.round() will give you a non-uniform distribution!
     */
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static disposeMaterial( obj ) {
        if ( obj.material ) {
            obj.material.dispose();
        }

    }

  
}