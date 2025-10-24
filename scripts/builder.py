import os

# builds a typescript array of all the creatures in the creatures folder

string = "export const creatures = ["
count = 0
for creatureFile in os.listdir('assets/creatureImages'):
    count += 1
    string += '{"id": ' + str(count) + ', "name": "' + creatureFile[:-4] + '", image: require("./creatureImages/' + creatureFile + '")},'

string += "];"

with open("assets/creatures.ts", "w") as creaturesFile:
    creaturesFile.write(string)