import StoryblokClient from "storyblok-js-client";

const OAUTH_TOKEN = Bun.env.STORYBLOK_OAUTH_TOKEN;
const SPACE_ID = Bun.env.STORYBLOK_SPACE_ID;

const Storyblok = new StoryblokClient({ oauthToken: OAUTH_TOKEN });

const usedComponents: Array<string> = [];
const unusedComponents: Array<string> = [];

console.info("Loading list of components");

// load information of first 100 components - otherwise we would need to use paging as 100 is max.
let components = await Storyblok.get(`spaces/${SPACE_ID}/components/`, {
	per_page: 100,
});

console.info("Looking for unused components");

for (
	let index = 0, max = components.data.components.length;
	index < max;
	index++
) {
	let component = components.data.components[index];

	let stories = await Storyblok.get(`spaces/${SPACE_ID}/stories/`, {
		contain_component: component.name,
		per_page: 1,
	});

	if (stories.data.stories.length > 0) {
		usedComponents.push(component.name);
	} else {
		unusedComponents.push(component.name);
	}

	console.info(`Looking for unused components (${index + 1}/${max})`);
}

console.info("Used Components: ", usedComponents);
console.info("Unused Components: ", unusedComponents);
