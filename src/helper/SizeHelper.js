import {PixelRatio} from "react-native";

class SizeHelper {
	constructor() {
	}

	fontPtToPx(points) {
		return PixelRatio.getFontScale() * points;
	}

	layoutPtToPx(points) {
		return PixelRatio.roundToNearestPixel(points);
	}
}

export default new SizeHelper();
