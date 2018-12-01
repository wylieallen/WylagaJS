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
            });
        }
    }
}

function entitiesCollide(entity1, entity2) {
    const
        minX1 = entity1.getX(),
        minY1 = entity1.getY(),
        minX2 = entity2.getX(),
        minY2 = entity2.getY(),
        maxX1 = minX1 + entity1.getWidth(),
        maxY1 = minY1 + entity1.getHeight(),
        maxX2 = minX2 + entity2.getWidth(),
        maxY2 = minY2 + entity2.getHeight();

    if (minY1 > maxY2 || minY2 > maxY1)
    {
        return false;
    }

    else return !(minX1 > maxX2 || minX2 > maxX1);
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

