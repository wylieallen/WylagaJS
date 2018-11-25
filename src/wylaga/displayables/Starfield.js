import CompositeDisplayable from "../../displayables/composites/CompositeDisplayable";
import SolidRect from "../../displayables/primitives/SolidRect";

export default function makeStarfield(width, height, starCount) {
    const root = new CompositeDisplayable(0, 0);

    root.add(new SolidRect(0, 0, width, height, "#000000"));

    for(let i = 0; i < starCount; i++)
    {
        const star = new SolidRect(
            Math.floor(Math.random() * width),
            Math.floor(Math.random() * height),
            1,
            1,
            '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16)
        );

        const velocity = Math.random() * 3 + 0.2;
        star.update = () => {
            star.translate(0, velocity);
            if(star.getY() >= height)
            {
                star.setY(0);
            }
        };
        root.add(star);
    }

    return root;
};