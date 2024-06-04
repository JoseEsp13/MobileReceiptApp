import { memberSums, getCountOfItems } from "./Verification.tsx";

/* Generates an array of prices of quantity numItems as argument */
const generateItemPrices = (numItems: number): number[] => {
    let itemPrices = [];
    for (var i = 0; i < numItems; i++) {
        var newPrice = Number((Math.random() * 10).toFixed(2));
        itemPrices.push(newPrice)
    }
    return itemPrices;
}

/* Function to randomly generate a MemberDict with a specified number of members and items,
 returns an array containing the MemberDict, totalNumberOfItems assigned to any user, and the totalPrice */
const generateMemberDict = (numMembers: number, numItems: number): [MemberDict: MemberDict, totalNumItems: number, priceTotal: number] => {
    console.log("Generating MemberDict")
    let memberDict: MemberDict = {};
    let totalItemsAssigned = 0
    let itemPrices = generateItemPrices(numItems)
    let itemsLogged: string[] = [];
    let priceSum = 0

    for (var i = 0; i < numMembers; i++) {
        let itemDict: {[item: string]: number} = {};
        for (var j = 0; j < numItems; j++) {
            if (Math.random() < .5) {
                // member gets the item by coinflip
                totalItemsAssigned += 1
                let key = "item#" + String(j)
                itemDict[key] = itemPrices[j]
                if (itemsLogged.includes(key)) {
                    
                } else {
                    itemsLogged.push(key)
                    priceSum += itemPrices[j]
                }
            }
        }
        memberDict["member#" + String(i)] = itemDict
    }
    return [memberDict, totalItemsAssigned, priceSum]
};

/* The manually built test cases for getCountOfItems */
const manualCountTest = (): boolean => {
    let memberDict: MemberDict = { 
        "Darren": { "Milk": 1, "Cheese": 2, "Meat": 3 },
        "Thomas": { "Meat": 3, "Cheese": 2, "IceCream": 4 },
    };

    
    let itemCountDict = getCountOfItems(memberDict)
    let manualDict: {[item: string]: number} = {"Milk": 1, "Cheese": 2, "Meat": 2, "IceCream": 1};

    for (let key in itemCountDict) {
        if (itemCountDict[key] == manualDict[key]) {
            console.log("Passes manual Test for key=" + key)
        } else {
            console.log("Failed manual Test on key=" + key + " got count=" + String(itemCountDict[key]) + " but expected count=" + String(manualDict[key]))
            return false
        }
    }
    return true
}

/* Function that runs the manual tests for getCountOfItems and a specified number of randomly generated test */
export const testGetCountOfItems = (numTests: number): boolean => {
    if (!manualCountTest()) {
        return false
    }

    for (var i = 0; i < numTests; i++) {
        let generatedItems = generateMemberDict(i, i)
        let memberDict: MemberDict = generatedItems[0]
        
        let itemCountDict = getCountOfItems(memberDict)
        let sum = 0
        console.log(memberDict)
        console.log(itemCountDict)
        for (let key in itemCountDict) {
            sum += itemCountDict[key]
        }
        if (sum == generatedItems[1]) {
            console.log("getCountOfItems passed test case #" + String(i))
        } else {
            console.log("getCountOfItems failed test case #" + String(i))
            console.log("Expected item count=" + String(generatedItems[1]) + " got item count=" + String(sum))
            return false
        }
    }
    console.log("Passed all tests!")
    return true
}

export const testGenMemberSums = (numTests: number): boolean => {
    for (var i = 1; i <= numTests; i++) {
        let generatedItems = generateMemberDict(i, i)
        let memberDict: MemberDict = generatedItems[0]
        let expectedSum = Number((generatedItems[2]).toFixed(2))
        let memberCostDict = memberSums(memberDict)
        let sum = 0
        console.log("memberDict = ")
        console.log(memberDict)
        console.log("memberCostDict = ")
        console.log(memberCostDict)
        for (let key in memberCostDict) {
            sum += memberCostDict[key]
        }
        sum = Number((sum).toFixed(2))
        if (sum == expectedSum) {
            console.log("memberSums passed test case #" + String(i))
        } else {
            console.log("memberSums failed test case #" + String(i))
            console.log("Expected sum=" + String(expectedSum) + " instead got sum=" + String(sum))
            return false
        }
    }
    console.log("Passed all tests!")
    return true
} 

console.log(testGetCountOfItems(10))


type MemberDict = { [member: string]: { [key: string]: number } };

// Function to test the memberSums function

// function testMemberSums() {    
//     describe('memberSums function', () => {
//         let memberDict: MemberDict = { 
//             "Darren": { "Milk": 1, "Cheese": 2, "Meat": 3 },
//             "Thomas": { "Meat": 3, "Cheese": 2, "IceCream": 4 },
//         };
//         test('memberSums output', () => {
//             const result = memberSums(memberDict);
//             expect(result.Darren).toBe(3.5);
//             expect(result.Thomas).toBe(6.5);
//         });
//     });
// }
