import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GameManager, gameManager } from "src/app/game/businesslogic/GameManager";
import { SettingsManager, settingsManager } from "src/app/game/businesslogic/SettingsManager";
import { AttackModifier, defaultAttackModifier } from "src/app/game/model/AttackModifier";
import { Character } from "src/app/game/model/Character";
import { PerkType } from "src/app/game/model/Perks";

@Component({
  selector: 'ghs-attackmodifier-tool',
  templateUrl: './attackmodifier-tool.html',
  styleUrls: ['./attackmodifier-tool.scss']
})
export class AttackModifierToolComponent implements OnInit {

  gameManager: GameManager = gameManager;
  settingsManager: SettingsManager = settingsManager;
  characters: Character[] = [];
  edition: string | undefined;

  constructor(private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    await settingsManager.init();
    gameManager.stateManager.init();
    this.edition = gameManager.editions(true)[0];
    this.update();

    this.route.queryParams.subscribe({
      next: (queryParams) => {
        if (queryParams['edition']) {
          this.edition = queryParams['edition'];
          if (this.edition && gameManager.editions(true).indexOf(this.edition) == -1) {
            this.edition == undefined;
          }
          this.update();
        }
      }
    })
  }

  update() {
    this.characters = [];
    gameManager.charactersData(this.edition).forEach((characterData) => {
      let character = new Character(characterData, 0);

      character.attackModifierDeck.cards = [];

      let perkId = 0;
      character.perks.forEach((perk) => {
        if (perk.cards) {
          perk.cards.forEach((card, index) => {
            if (perk.type == PerkType.add || perk.type == PerkType.replace) {
              let am = Object.assign(new AttackModifier(card.attackModifier.type), card.attackModifier);
              am.id = "perk" + perkId;
              if (!gameManager.attackModifierManager.findByAttackModifier(defaultAttackModifier, am) || perk.type == PerkType.add || index > 0) {
                am.character = true;
              }
              if (am.character) {
                if (!gameManager.attackModifierManager.findByAttackModifier(character.attackModifierDeck.cards, am)) {
                  perkId++;
                }
                for (let i = 0; i < card.count * perk.count; i++) {
                  character.attackModifierDeck.cards.push(am);
                }
              }
            }
          })
        }
      })

      this.characters.push(character);
    })
    this.characters.sort((a, b) => {
      if (a.edition != b.edition) {
        return a.edition < b.edition ? -1 : 1;
      } else {
        let aName = settingsManager.getLabel('data.character.' + a.name).toLowerCase();
        let bName = settingsManager.getLabel('data.character.' + b.name).toLowerCase();
        return aName < bName ? -1 : 1;
      }
    })
  }

  updateQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: { edition: this.edition || undefined },
        queryParamsHandling: 'merge'
      });
  }

}
