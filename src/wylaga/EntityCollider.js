import {entitiesCollide} from "./Collision";

export default class EntityCollider {
    constructor() {
        const primaries = new Set();

        this.addPrimary = group => primaries.add(group);

        this.processCollisions = () => {
            primaries.forEach(primaryGroup => {
                primaryGroup.getEntities().forEach(primaryEntity => {
                    primaryGroup.getSecondaries().forEach(secondaryGroup => {
                        secondaryGroup.getEntities().forEach(secondaryEntity => {
                            if(entitiesCollide(primaryEntity, secondaryEntity))
                                secondaryGroup.onCollision(primaryEntity, secondaryEntity);
                        })
                    })
                })
            })
        }
    }
}

export class PrimaryGroup {
    constructor(entities) {
        const secondaries = new Set();

        this.addSecondaryGroup = group => secondaries.add(group);

        this.getEntities = () => entities;
        this.getSecondaries = () => secondaries;
    }
}

export class SecondaryGroup {
    constructor(entities, onCollision) {
        this.getEntities = () => entities;

        this.onCollision = onCollision;
    }
}
