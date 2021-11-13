import "reflect-metadata";
const formatMetadataKey = Symbol("format");

function Entity(tableName: string) { 
  return <T extends { new (...args: any[]): {} }>(constructor: T) => { 
    //constructor.prototype.lucky = Math.floor(Math.random() * Math.floor(limit)
    return class extends constructor {
        reportingURL = "http://www...";
    };
  }
}

function PrimaryGeneratedColumn(columnName: string) {
    const dbg = Reflect.metadata(formatMetadataKey, columnName);
    return dbg;
}

function getPrimaryGeneratedColumnName(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}


function Column(columnName: string) {
    const dbg = Reflect.metadata(formatMetadataKey, columnName);
    return dbg;
}

function getColumnName(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class EnhancedArray<T> extends Array<T>{
    protected parent?: EnhancedArray<T>;
    private sql: string;

    constructor(...items: T[]) {
        super(...items);
        this.sql = "";
        this.parent = undefined;
    }


    GREATER_THAN(key: keyof T, targetValue: any): EnhancedArray<T> {
        const filtered =  this.filter(value => value[key] > targetValue);
        const retValue = new EnhancedArray<T>(...filtered);
        retValue.parent = this;

        if (!this.parent) {
            this.sql = `select * from Orders where ${key} > ${targetValue}`;
        } else {
            this.sql = `and ${key} > ${typeof targetValue == typeof "" ? `'${targetValue}'` : targetValue}`;
        }

        return retValue;
    }
//()
    // create<K extends keyof T, G extends T>(ttt: (item: G) => G[keyof G], c: { new (): G }, assesor: (item: typeof c) => boolean): G {
    //     const omg = new c() as G;

    //     // type OptionsFlags<Type> = {
    //     //     [Property in keyof Type]: boolean;
    //     // };

        
    //     console.log(Object.keys(omg));
    //     return omg;
    // }

    // LESS_THAN<K extends keyof T, G extends T>(temp: T[K], accesor: (fake: G) => G[K], targetValue: any): EnhancedArray<T> {
    //     type Clone = {
    //         [P in keyof T]: T[P];
    //     };


    

    LESS_THAN<K extends keyof T>(accesor: (item: T) => T[K], targetValue: any): EnhancedArray<T> {
    //   const i: T = this[0];
    //    const t = accesor(i);
    //     type valueof = T[keyof T];
    // const aaaa: valueof = accesor(i);
    //     console.log(aaaa);
      
        // const aaaa: (item: T, key: keyof T) => T[K] = (item) => {
        //     console.log(key);
        // }
        
        type TodoKeys = keyof T; // "id" | "text" | "due"
        const target: TodoKeys = { } as TodoKeys;
        
        console.log(target);

        // .forEach(key => {
        //     Object.defineProperty(target, key, {
        //         get() { console.log(`hi from ${key}`) },
        //     });
        // })
     

        //accesor(target);
        


        //debugger;
        // console.log(accesor);
        // aaaa(this[0]);

        return this;
        // const filtered =  this.filter(value => value[key] > targetValue);
        // const retValue = new EnhancedArray<T>(...filtered);
        // retValue.parent = this;

        // if (!this.parent) {
        //     this.sql = `select * from Orders where ${key} > ${targetValue}`;
        // } else {
        //     this.sql = `and ${key} > ${typeof targetValue == typeof "" ? `'${targetValue}'` : targetValue}`;
        // }

        // return retValue;
    }

    EQUAL(key: keyof T, targetValue: any): EnhancedArray<T> {
        const filtered =  this.filter(value => value[key] > targetValue);
        const retValue = new EnhancedArray<T>(...filtered);
        retValue.parent = this;
        if (!this.parent) {
            this.sql = `select * from Orders where ${key} = ${targetValue}`;
        } else {
            this.sql = `and ${key} = ${typeof targetValue == typeof "" ? `'${targetValue}'` : targetValue}`;
        }

        return retValue;
    }

    // singleOrDefault = callback => {
    //     var foundFirst = this.findIndex(callback);
    //     if (foundFirst > -1) {
    //     var foundSecond = 
    //     this
    //     .slice(foundFirst + 1)
    //     .findIndex(callback);
        
    //     return foundSecond > -1 ? undefined : this[foundFirst];
    //     }
    //     return undefined;
    // }

    toSQL(): string {
        if (!!this.parent) {
            const parentSQL = this.parent.toSQL();
            const thisSQL = !!this.sql && this.sql.length > 0 ? " " + this.sql : "";
            return this.parent.toSQL() + thisSQL;
        }
        return this.sql;
    }
}

@Entity("Orders")
class Order {
    @PrimaryGeneratedColumn("id")
    id: number = NaN
    
    @Column("amount")
    amount: number = NaN
    
    @Column("country")
    country?: string

    // private discounted: boolean = false;
    
    // set discounted(value: boolean) {
    //     this._discounted = value;
    // }
}



const orders = new EnhancedArray<Order>();
orders.push(
    { id: 1, amount: 140, country: "USA"},
    { id: 2, amount: 120, country: "AUS"},
    { id: 3, amount: 50, country: "JPN"}
);

// function prop<T extends object, K extends keyof T>(obj: T, key: K) {
//   return obj[key];
// }

// type K1 = keyof Order; // "name" | "age" | "location"
// const kkk: K1 = "name";

//prop(new Order(). )
// orders.create(Order, e => e.);
orders.LESS_THAN(order => order.amount, 1);

// (a => a.amount, 100);


// best order => order.amount
// mimic fake order => order.amount is "amount"

// console.log(
//     orders
//     .GREATER_THAN("amount", 100)
//     .EQUAL("country", "JPN")
//     .toSQL()
// );


// "select * from Orders where amount > 100 and amount > 100 and country = AUS and country = JPN"