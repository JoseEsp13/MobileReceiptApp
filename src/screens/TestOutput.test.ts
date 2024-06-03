import { memberSums, getCountOfItems } from "./Verification";


const generateItemPrices = (numItems: number): number[] => {
    let itemPrices = [];
    for (var i = 0; i < numItems; i++) {
        var newPrice = Number((Math.random() * 10).toFixed(2));
        itemPrices.push(newPrice)
    }
    return itemPrices;
}
type MemberDict = { [member: string]: { [key: string]: number } };

const generateMemberDict = (numMembers: number, numItems: number): (MemberDict, number) => {
    let memberDict: MemberDict = {};
    let totalItemsAssigned = 0
    let itemPrices = generateItemPrices(numItems)

    for (var i = 0; i < numMembers; i++) {
        let itemDict: {[item: string]: number} = {};
        for (var j = 0; j < numItems; j++) {
            if (Math.random() < .5) {
                // member gets the item by coinflip
                totalItemsAssigned += 1
                itemDict["item#" + String(j)] = itemPrices[j]
            }
        }
        memberDict["member#" + String(i)] = itemDict
    }
    console.log(totalItemsAssigned)
    return memberDict
}

const testGetCountOfItems = (numberOfTests: number): boolean => {
    
}


// Function to test the memberSums function
function testMemberSums() {    
    describe('memberSums function', () => {
        let memberDict: MemberDict = { 
            "Darren": { "Milk": 1, "Cheese": 2, "Meat": 3 },
            "Thomas": { "Meat": 3, "Cheese": 2, "IceCream": 4 },
        };
        test('memberSums output', () => {
            const result = memberSums(memberDict);
            expect(result.Darren).toBe(3.5);
            expect(result.Thomas).toBe(6.5);
        });
    });
}