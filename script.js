let canvas = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
let width = canvas.width = (window.innerWidth);
let height = canvas.height = (window.innerHeight);
let scale = 50
const sizeConstant = 0.03

///////// Camera management
let mouseOn, pmouseX, pmouseY, mouseX, mouseY;
const zoomSensitivity = 0.02
const moveSensitivity = 0.002
const maxMoveSpeed = 0.2
const maxScale = 120
const minScale = 40
const focalLength = 16
let displayCenterX = width / 2, displayCenterY = height / 2

//////// Camera position
const rho = 300
let theta = Math.PI / 2 - 1
let phi = 0
let cameraX, cameraY, cameraZ, canvasCenterX, canvasCenterY, canvasCenterZ
updateCameraXYZ()

let spinX = 0.1, spinY = 0.1, swap = 1

let projectionMatrix = [1, 0, 0,
    0, 1, 0,
    0, 0, 1]

let dz = -5, dxDraw = 0, sideOn = false, splashOn = false;
let selectedDotIndex = -1;

let dots = [], lines = []


//////// Grid Lines and axes

const gridLines = [[[-5, -5, dz], [-5, 5, dz], 0.3],
    [[-5, 5, dz], [5, 5, dz], 0.3],
    [[5, 5, dz], [5, -5, dz], 0.3],
    [[-5, -5, dz], [5, -5, dz], 0.3],

    [[-4, -5, dz], [-4, 5, dz], 0.3],
    [[-3, -5, dz], [-3, 5, dz], 0.3],
    [[-2, -5, dz], [-2, 5, dz], 0.3],
    [[-1, -5, dz], [-1, 5, dz], 0.3],
    [[0, -5, dz], [0, 5, dz], 1],
    [[1, -5, dz], [1, 5, dz], 0.3],
    [[2, -5, dz], [2, 5, dz], 0.3],
    [[3, -5, dz], [3, 5, dz], 0.3],
    [[4, -5, dz], [4, 5, dz], 0.3],

    [[-5, 4, dz], [5, 4, dz], 0.3],
    [[-5, 3, dz], [5, 3, dz], 0.3],
    [[-5, 2, dz], [5, 2, dz], 0.3],
    [[-5, 1, dz], [5, 1, dz], 0.3],
    [[-5, 0, dz], [5, 0, dz], 1],
    [[-5, -4, dz], [5, -4, dz], 0.3],
    [[-5, -3, dz], [5, -3, dz], 0.3],
    [[-5, -2, dz], [5, -2, dz], 0.3],
    [[-5, -1, dz], [5, -1, dz], 0.3],

    [[0, 0, dz], [0, 0, 10 + dz], 1],
]

let labels = []

// Seraphine only
// const allSkins = ['Seraphine_0.jpg', 'Seraphine_1.jpg', 'Seraphine_14.jpg', 'Seraphine_15.jpg', 'Seraphine_2.jpg', 'Seraphine_3.jpg', 'Seraphine_4.jpg']

// All skins
const allSkins = ['Aatrox_0.jpg', 'Aatrox_1.jpg', 'Aatrox_11.jpg', 'Aatrox_2.jpg', 'Aatrox_20.jpg', 'Aatrox_21.jpg', 'Aatrox_3.jpg', 'Aatrox_7.jpg', 'Aatrox_8.jpg', 'Aatrox_9.jpg', 'Ahri_0.jpg', 'Ahri_1.jpg', 'Ahri_14.jpg', 'Ahri_15.jpg', 'Ahri_16.jpg', 'Ahri_17.jpg', 'Ahri_2.jpg', 'Ahri_27.jpg', 'Ahri_28.jpg', 'Ahri_3.jpg', 'Ahri_4.jpg', 'Ahri_42.jpg', 'Ahri_5.jpg', 'Ahri_6.jpg', 'Ahri_65.jpg', 'Ahri_66.jpg', 'Ahri_7.jpg', 'Akali_0.jpg', 'Akali_1.jpg', 'Akali_13.jpg', 'Akali_14.jpg', 'Akali_15.jpg', 'Akali_2.jpg', 'Akali_3.jpg', 'Akali_32.jpg', 'Akali_4.jpg', 'Akali_5.jpg', 'Akali_50.jpg', 'Akali_6.jpg', 'Akali_60.jpg', 'Akali_61.jpg', 'Akali_7.jpg', 'Akali_8.jpg', 'Akali_9.jpg', 'Akshan_0.jpg', 'Akshan_1.jpg', 'Akshan_10.jpg', 'Alistar_0.jpg', 'Alistar_1.jpg', 'Alistar_10.jpg', 'Alistar_19.jpg', 'Alistar_2.jpg', 'Alistar_20.jpg', 'Alistar_22.jpg', 'Alistar_29.jpg', 'Alistar_3.jpg', 'Alistar_4.jpg', 'Alistar_5.jpg', 'Alistar_6.jpg', 'Alistar_7.jpg', 'Alistar_8.jpg', 'Alistar_9.jpg', 'Amumu_0.jpg', 'Amumu_1.jpg', 'Amumu_17.jpg', 'Amumu_2.jpg', 'Amumu_23.jpg', 'Amumu_24.jpg', 'Amumu_3.jpg', 'Amumu_34.jpg', 'Amumu_4.jpg', 'Amumu_5.jpg', 'Amumu_6.jpg', 'Amumu_7.jpg', 'Amumu_8.jpg', 'Anivia_0.jpg', 'Anivia_1.jpg', 'Anivia_17.jpg', 'Anivia_2.jpg', 'Anivia_27.jpg', 'Anivia_3.jpg', 'Anivia_4.jpg', 'Anivia_5.jpg', 'Anivia_6.jpg', 'Anivia_7.jpg', 'Anivia_8.jpg', 'Annie_0.jpg', 'Annie_1.jpg', 'Annie_10.jpg', 'Annie_11.jpg', 'Annie_12.jpg', 'Annie_13.jpg', 'Annie_2.jpg', 'Annie_22.jpg', 'Annie_3.jpg', 'Annie_4.jpg', 'Annie_5.jpg', 'Annie_6.jpg', 'Annie_7.jpg', 'Annie_8.jpg', 'Annie_9.jpg', 'Aphelios_0.jpg', 'Aphelios_1.jpg', 'Aphelios_18.jpg', 'Aphelios_9.jpg', 'Ashe_0.jpg', 'Ashe_1.jpg', 'Ashe_11.jpg', 'Ashe_17.jpg', 'Ashe_2.jpg', 'Ashe_23.jpg', 'Ashe_3.jpg', 'Ashe_32.jpg', 'Ashe_4.jpg', 'Ashe_43.jpg', 'Ashe_5.jpg', 'Ashe_6.jpg', 'Ashe_7.jpg', 'Ashe_8.jpg', 'Ashe_9.jpg', 'AurelionSol_0.jpg', 'AurelionSol_1.jpg', 'AurelionSol_11.jpg', 'AurelionSol_2.jpg', 'Azir_0.jpg', 'Azir_1.jpg', 'Azir_2.jpg', 'Azir_3.jpg', 'Azir_4.jpg', 'Azir_5.jpg', 'Bard_0.jpg', 'Bard_1.jpg', 'Bard_17.jpg', 'Bard_5.jpg', 'Bard_6.jpg', 'Bard_8.jpg', 'Belveth_0.jpg', 'Belveth_1.jpg', 'Blitzcrank_0.jpg', 'Blitzcrank_1.jpg', 'Blitzcrank_11.jpg', 'Blitzcrank_2.jpg', 'Blitzcrank_20.jpg', 'Blitzcrank_21.jpg', 'Blitzcrank_22.jpg', 'Blitzcrank_29.jpg', 'Blitzcrank_3.jpg', 'Blitzcrank_36.jpg', 'Blitzcrank_4.jpg', 'Blitzcrank_5.jpg', 'Blitzcrank_6.jpg', 'Blitzcrank_7.jpg', 'Brand_0.jpg', 'Brand_1.jpg', 'Brand_2.jpg', 'Brand_21.jpg', 'Brand_22.jpg', 'Brand_3.jpg', 'Brand_4.jpg', 'Brand_5.jpg', 'Brand_6.jpg', 'Brand_7.jpg', 'Brand_8.jpg', 'Braum_0.jpg', 'Braum_1.jpg', 'Braum_10.jpg', 'Braum_11.jpg', 'Braum_2.jpg', 'Braum_24.jpg', 'Braum_3.jpg', 'Braum_33.jpg', 'Caitlyn_0.jpg', 'Caitlyn_1.jpg', 'Caitlyn_10.jpg', 'Caitlyn_11.jpg', 'Caitlyn_13.jpg', 'Caitlyn_19.jpg', 'Caitlyn_2.jpg', 'Caitlyn_20.jpg', 'Caitlyn_22.jpg', 'Caitlyn_28.jpg', 'Caitlyn_29.jpg', 'Caitlyn_3.jpg', 'Caitlyn_30.jpg', 'Caitlyn_4.jpg', 'Caitlyn_5.jpg', 'Caitlyn_6.jpg', 'Camille_0.jpg', 'Camille_1.jpg', 'Camille_10.jpg', 'Camille_11.jpg', 'Camille_2.jpg', 'Cassiopeia_0.jpg', 'Cassiopeia_1.jpg', 'Cassiopeia_18.jpg', 'Cassiopeia_2.jpg', 'Cassiopeia_3.jpg', 'Cassiopeia_4.jpg', 'Cassiopeia_8.jpg', 'Cassiopeia_9.jpg', 'Chogath_0.jpg', 'Chogath_1.jpg', 'Chogath_14.jpg', 'Chogath_2.jpg', 'Chogath_3.jpg', 'Chogath_4.jpg', 'Chogath_5.jpg', 'Chogath_6.jpg', 'Chogath_7.jpg', 'Corki_0.jpg', 'Corki_1.jpg', 'Corki_18.jpg', 'Corki_2.jpg', 'Corki_26.jpg', 'Corki_3.jpg', 'Corki_4.jpg', 'Corki_5.jpg', 'Corki_6.jpg', 'Corki_7.jpg', 'Corki_8.jpg', 'Darius_0.jpg', 'Darius_1.jpg', 'Darius_14.jpg', 'Darius_15.jpg', 'Darius_16.jpg', 'Darius_2.jpg', 'Darius_24.jpg', 'Darius_3.jpg', 'Darius_33.jpg', 'Darius_4.jpg', 'Darius_8.jpg', 'Diana_0.jpg', 'Diana_1.jpg', 'Diana_11.jpg', 'Diana_12.jpg', 'Diana_18.jpg', 'Diana_2.jpg', 'Diana_25.jpg', 'Diana_26.jpg', 'Diana_27.jpg', 'Diana_3.jpg', 'Diana_37.jpg', 'Draven_0.jpg', 'Draven_1.jpg', 'Draven_12.jpg', 'Draven_13.jpg', 'Draven_2.jpg', 'Draven_20.jpg', 'Draven_29.jpg', 'Draven_3.jpg', 'Draven_4.jpg', 'Draven_5.jpg', 'Draven_6.jpg', 'DrMundo_0.jpg', 'DrMundo_1.jpg', 'DrMundo_10.jpg', 'DrMundo_2.jpg', 'DrMundo_3.jpg', 'DrMundo_4.jpg', 'DrMundo_5.jpg', 'DrMundo_6.jpg', 'DrMundo_7.jpg', 'DrMundo_8.jpg', 'DrMundo_9.jpg', 'Ekko_0.jpg', 'Ekko_1.jpg', 'Ekko_11.jpg', 'Ekko_12.jpg', 'Ekko_19.jpg', 'Ekko_2.jpg', 'Ekko_28.jpg', 'Ekko_3.jpg', 'Ekko_36.jpg', 'Ekko_45.jpg', 'Ekko_46.jpg', 'Elise_0.jpg', 'Elise_1.jpg', 'Elise_15.jpg', 'Elise_2.jpg', 'Elise_3.jpg', 'Elise_4.jpg', 'Elise_5.jpg', 'Elise_6.jpg', 'Evelynn_0.jpg', 'Evelynn_1.jpg', 'Evelynn_15.jpg', 'Evelynn_2.jpg', 'Evelynn_24.jpg', 'Evelynn_3.jpg', 'Evelynn_31.jpg', 'Evelynn_4.jpg', 'Evelynn_5.jpg', 'Evelynn_6.jpg', 'Evelynn_7.jpg', 'Evelynn_8.jpg', 'Ezreal_0.jpg', 'Ezreal_1.jpg', 'Ezreal_18.jpg', 'Ezreal_19.jpg', 'Ezreal_2.jpg', 'Ezreal_20.jpg', 'Ezreal_21.jpg', 'Ezreal_22.jpg', 'Ezreal_23.jpg', 'Ezreal_25.jpg', 'Ezreal_3.jpg', 'Ezreal_4.jpg', 'Ezreal_5.jpg', 'Ezreal_6.jpg', 'Ezreal_7.jpg', 'Ezreal_8.jpg', 'Ezreal_9.jpg', 'FiddleSticks_0.jpg', 'FiddleSticks_1.jpg', 'FiddleSticks_2.jpg', 'FiddleSticks_27.jpg', 'FiddleSticks_3.jpg', 'FiddleSticks_4.jpg', 'FiddleSticks_5.jpg', 'FiddleSticks_6.jpg', 'FiddleSticks_7.jpg', 'FiddleSticks_8.jpg', 'FiddleSticks_9.jpg', 'Fiora_0.jpg', 'Fiora_1.jpg', 'Fiora_2.jpg', 'Fiora_22.jpg', 'Fiora_23.jpg', 'Fiora_3.jpg', 'Fiora_31.jpg', 'Fiora_4.jpg', 'Fiora_41.jpg', 'Fiora_5.jpg', 'Fiora_50.jpg', 'Fiora_51.jpg', 'Fiora_60.jpg', 'Fizz_0.jpg', 'Fizz_1.jpg', 'Fizz_10.jpg', 'Fizz_14.jpg', 'Fizz_15.jpg', 'Fizz_16.jpg', 'Fizz_2.jpg', 'Fizz_25.jpg', 'Fizz_3.jpg', 'Fizz_4.jpg', 'Fizz_8.jpg', 'Fizz_9.jpg', 'Galio_0.jpg', 'Galio_1.jpg', 'Galio_13.jpg', 'Galio_19.jpg', 'Galio_2.jpg', 'Galio_3.jpg', 'Galio_4.jpg', 'Galio_5.jpg', 'Galio_6.jpg', 'Gangplank_0.jpg', 'Gangplank_1.jpg', 'Gangplank_14.jpg', 'Gangplank_2.jpg', 'Gangplank_21.jpg', 'Gangplank_23.jpg', 'Gangplank_3.jpg', 'Gangplank_4.jpg', 'Gangplank_5.jpg', 'Gangplank_6.jpg', 'Gangplank_7.jpg', 'Gangplank_8.jpg', 'Garen_0.jpg', 'Garen_1.jpg', 'Garen_10.jpg', 'Garen_11.jpg', 'Garen_13.jpg', 'Garen_14.jpg', 'Garen_2.jpg', 'Garen_22.jpg', 'Garen_23.jpg', 'Garen_24.jpg', 'Garen_3.jpg', 'Garen_4.jpg', 'Garen_5.jpg', 'Garen_6.jpg', 'Gnar_0.jpg', 'Gnar_1.jpg', 'Gnar_13.jpg', 'Gnar_14.jpg', 'Gnar_15.jpg', 'Gnar_2.jpg', 'Gnar_22.jpg', 'Gnar_3.jpg', 'Gnar_4.jpg', 'Gragas_0.jpg', 'Gragas_1.jpg', 'Gragas_10.jpg', 'Gragas_11.jpg', 'Gragas_2.jpg', 'Gragas_3.jpg', 'Gragas_4.jpg', 'Gragas_5.jpg', 'Gragas_6.jpg', 'Gragas_7.jpg', 'Gragas_8.jpg', 'Gragas_9.jpg', 'Graves_0.jpg', 'Graves_1.jpg', 'Graves_14.jpg', 'Graves_18.jpg', 'Graves_2.jpg', 'Graves_25.jpg', 'Graves_3.jpg', 'Graves_35.jpg', 'Graves_4.jpg', 'Graves_42.jpg', 'Graves_5.jpg', 'Graves_6.jpg', 'Graves_7.jpg', 'Gwen_0.jpg', 'Gwen_1.jpg', 'Gwen_11.jpg', 'Hecarim_0.jpg', 'Hecarim_1.jpg', 'Hecarim_14.jpg', 'Hecarim_2.jpg', 'Hecarim_22.jpg', 'Hecarim_3.jpg', 'Hecarim_4.jpg', 'Hecarim_5.jpg', 'Hecarim_6.jpg', 'Hecarim_7.jpg', 'Hecarim_8.jpg', 'Heimerdinger_0.jpg', 'Heimerdinger_1.jpg', 'Heimerdinger_15.jpg', 'Heimerdinger_2.jpg', 'Heimerdinger_24.jpg', 'Heimerdinger_3.jpg', 'Heimerdinger_4.jpg', 'Heimerdinger_5.jpg', 'Heimerdinger_6.jpg', 'Illaoi_0.jpg', 'Illaoi_1.jpg', 'Illaoi_10.jpg', 'Illaoi_18.jpg', 'Illaoi_2.jpg', 'Irelia_0.jpg', 'Irelia_1.jpg', 'Irelia_15.jpg', 'Irelia_16.jpg', 'Irelia_17.jpg', 'Irelia_18.jpg', 'Irelia_2.jpg', 'Irelia_26.jpg', 'Irelia_3.jpg', 'Irelia_36.jpg', 'Irelia_4.jpg', 'Irelia_5.jpg', 'Irelia_6.jpg', 'Ivern_0.jpg', 'Ivern_1.jpg', 'Ivern_11.jpg', 'Ivern_2.jpg', 'Janna_0.jpg', 'Janna_1.jpg', 'Janna_13.jpg', 'Janna_2.jpg', 'Janna_20.jpg', 'Janna_27.jpg', 'Janna_3.jpg', 'Janna_36.jpg', 'Janna_4.jpg', 'Janna_5.jpg', 'Janna_6.jpg', 'Janna_7.jpg', 'Janna_8.jpg', 'JarvanIV_0.jpg', 'JarvanIV_1.jpg', 'JarvanIV_11.jpg', 'JarvanIV_2.jpg', 'JarvanIV_21.jpg', 'JarvanIV_3.jpg', 'JarvanIV_30.jpg', 'JarvanIV_4.jpg', 'JarvanIV_5.jpg', 'JarvanIV_6.jpg', 'JarvanIV_7.jpg', 'JarvanIV_8.jpg', 'JarvanIV_9.jpg', 'Jax_0.jpg', 'Jax_1.jpg', 'Jax_12.jpg', 'Jax_13.jpg', 'Jax_14.jpg', 'Jax_2.jpg', 'Jax_20.jpg', 'Jax_21.jpg', 'Jax_3.jpg', 'Jax_4.jpg', 'Jax_5.jpg', 'Jax_6.jpg', 'Jax_7.jpg', 'Jax_8.jpg', 'Jayce_0.jpg', 'Jayce_1.jpg', 'Jayce_15.jpg', 'Jayce_2.jpg', 'Jayce_24.jpg', 'Jayce_3.jpg', 'Jayce_4.jpg', 'Jayce_5.jpg', 'Jhin_0.jpg', 'Jhin_1.jpg', 'Jhin_14.jpg', 'Jhin_2.jpg', 'Jhin_23.jpg', 'Jhin_3.jpg', 'Jhin_4.jpg', 'Jhin_5.jpg', 'Jinx_0.jpg', 'Jinx_1.jpg', 'Jinx_12.jpg', 'Jinx_13.jpg', 'Jinx_2.jpg', 'Jinx_20.jpg', 'Jinx_29.jpg', 'Jinx_3.jpg', 'Jinx_37.jpg', 'Jinx_38.jpg', 'Jinx_4.jpg', 'Jinx_40.jpg', 'Kaisa_0.jpg', 'Kaisa_1.jpg', 'Kaisa_14.jpg', 'Kaisa_15.jpg', 'Kaisa_16.jpg', 'Kaisa_17.jpg', 'Kaisa_26.jpg', 'Kaisa_27.jpg', 'Kaisa_29.jpg', 'Kaisa_39.jpg', 'Kaisa_40.jpg', 'Kalista_0.jpg', 'Kalista_1.jpg', 'Kalista_2.jpg', 'Kalista_3.jpg', 'Kalista_5.jpg', 'Karma_0.jpg', 'Karma_1.jpg', 'Karma_19.jpg', 'Karma_2.jpg', 'Karma_26.jpg', 'Karma_27.jpg', 'Karma_3.jpg', 'Karma_4.jpg', 'Karma_44.jpg', 'Karma_5.jpg', 'Karma_6.jpg', 'Karma_7.jpg', 'Karma_8.jpg', 'Karthus_0.jpg', 'Karthus_1.jpg', 'Karthus_10.jpg', 'Karthus_17.jpg', 'Karthus_2.jpg', 'Karthus_3.jpg', 'Karthus_4.jpg', 'Karthus_5.jpg', 'Karthus_9.jpg', 'Kassadin_0.jpg', 'Kassadin_1.jpg', 'Kassadin_14.jpg', 'Kassadin_15.jpg', 'Kassadin_2.jpg', 'Kassadin_3.jpg', 'Kassadin_4.jpg', 'Kassadin_5.jpg', 'Kassadin_6.jpg', 'Katarina_0.jpg', 'Katarina_1.jpg', 'Katarina_10.jpg', 'Katarina_12.jpg', 'Katarina_2.jpg', 'Katarina_21.jpg', 'Katarina_29.jpg', 'Katarina_3.jpg', 'Katarina_37.jpg', 'Katarina_4.jpg', 'Katarina_5.jpg', 'Katarina_6.jpg', 'Katarina_7.jpg', 'Katarina_8.jpg', 'Katarina_9.jpg', 'Kayle_0.jpg', 'Kayle_1.jpg', 'Kayle_15.jpg', 'Kayle_2.jpg', 'Kayle_24.jpg', 'Kayle_3.jpg', 'Kayle_33.jpg', 'Kayle_4.jpg', 'Kayle_42.jpg', 'Kayle_5.jpg', 'Kayle_6.jpg', 'Kayle_7.jpg', 'Kayle_8.jpg', 'Kayle_9.jpg', 'Kayn_0.jpg', 'Kayn_1.jpg', 'Kayn_15.jpg', 'Kayn_2.jpg', 'Kayn_8.jpg', 'Kayn_9.jpg', 'Kennen_0.jpg', 'Kennen_1.jpg', 'Kennen_2.jpg', 'Kennen_23.jpg', 'Kennen_3.jpg', 'Kennen_4.jpg', 'Kennen_5.jpg', 'Kennen_6.jpg', 'Kennen_7.jpg', 'Kennen_8.jpg', 'Khazix_0.jpg', 'Khazix_1.jpg', 'Khazix_11.jpg', 'Khazix_2.jpg', 'Khazix_3.jpg', 'Khazix_4.jpg', 'Khazix_60.jpg', 'Kindred_0.jpg', 'Kindred_1.jpg', 'Kindred_12.jpg', 'Kindred_2.jpg', 'Kindred_3.jpg', 'Kled_0.jpg', 'Kled_1.jpg', 'Kled_2.jpg', 'Kled_9.jpg', 'KogMaw_0.jpg', 'KogMaw_1.jpg', 'KogMaw_10.jpg', 'KogMaw_19.jpg', 'KogMaw_2.jpg', 'KogMaw_28.jpg', 'KogMaw_3.jpg', 'KogMaw_37.jpg', 'KogMaw_4.jpg', 'KogMaw_5.jpg', 'KogMaw_6.jpg', 'KogMaw_7.jpg', 'KogMaw_8.jpg', 'KogMaw_9.jpg', 'Leblanc_0.jpg', 'Leblanc_1.jpg', 'Leblanc_12.jpg', 'Leblanc_19.jpg', 'Leblanc_2.jpg', 'Leblanc_20.jpg', 'Leblanc_29.jpg', 'Leblanc_3.jpg', 'Leblanc_33.jpg', 'Leblanc_35.jpg', 'Leblanc_4.jpg', 'Leblanc_5.jpg', 'LeeSin_0.jpg', 'LeeSin_1.jpg', 'LeeSin_10.jpg', 'LeeSin_11.jpg', 'LeeSin_12.jpg', 'LeeSin_2.jpg', 'LeeSin_27.jpg', 'LeeSin_28.jpg', 'LeeSin_29.jpg', 'LeeSin_3.jpg', 'LeeSin_31.jpg', 'LeeSin_39.jpg', 'LeeSin_4.jpg', 'LeeSin_5.jpg', 'LeeSin_6.jpg', 'Leona_0.jpg', 'Leona_1.jpg', 'Leona_10.jpg', 'Leona_11.jpg', 'Leona_12.jpg', 'Leona_2.jpg', 'Leona_21.jpg', 'Leona_22.jpg', 'Leona_23.jpg', 'Leona_3.jpg', 'Leona_33.jpg', 'Leona_34.jpg', 'Leona_4.jpg', 'Leona_8.jpg', 'Leona_9.jpg', 'Lillia_0.jpg', 'Lillia_1.jpg', 'Lillia_10.jpg', 'Lissandra_0.jpg', 'Lissandra_1.jpg', 'Lissandra_12.jpg', 'Lissandra_2.jpg', 'Lissandra_23.jpg', 'Lissandra_3.jpg', 'Lissandra_4.jpg', 'Lucian_0.jpg', 'Lucian_1.jpg', 'Lucian_18.jpg', 'Lucian_19.jpg', 'Lucian_2.jpg', 'Lucian_25.jpg', 'Lucian_31.jpg', 'Lucian_6.jpg', 'Lucian_7.jpg', 'Lucian_8.jpg', 'Lucian_9.jpg', 'Lulu_0.jpg', 'Lulu_1.jpg', 'Lulu_14.jpg', 'Lulu_15.jpg', 'Lulu_2.jpg', 'Lulu_26.jpg', 'Lulu_27.jpg', 'Lulu_3.jpg', 'Lulu_37.jpg', 'Lulu_4.jpg', 'Lulu_5.jpg', 'Lulu_6.jpg', 'Lux_0.jpg', 'Lux_1.jpg', 'Lux_14.jpg', 'Lux_15.jpg', 'Lux_16.jpg', 'Lux_17.jpg', 'Lux_18.jpg', 'Lux_19.jpg', 'Lux_2.jpg', 'Lux_29.jpg', 'Lux_3.jpg', 'Lux_39.jpg', 'Lux_4.jpg', 'Lux_40.jpg', 'Lux_5.jpg', 'Lux_6.jpg', 'Lux_7.jpg', 'Lux_8.jpg', 'Malphite_0.jpg', 'Malphite_1.jpg', 'Malphite_16.jpg', 'Malphite_2.jpg', 'Malphite_23.jpg', 'Malphite_24.jpg', 'Malphite_25.jpg', 'Malphite_27.jpg', 'Malphite_3.jpg', 'Malphite_4.jpg', 'Malphite_5.jpg', 'Malphite_6.jpg', 'Malphite_7.jpg', 'Malzahar_0.jpg', 'Malzahar_1.jpg', 'Malzahar_18.jpg', 'Malzahar_2.jpg', 'Malzahar_28.jpg', 'Malzahar_3.jpg', 'Malzahar_4.jpg', 'Malzahar_5.jpg', 'Malzahar_6.jpg', 'Malzahar_7.jpg', 'Malzahar_9.jpg', 'Maokai_0.jpg', 'Maokai_1.jpg', 'Maokai_16.jpg', 'Maokai_2.jpg', 'Maokai_24.jpg', 'Maokai_3.jpg', 'Maokai_4.jpg', 'Maokai_5.jpg', 'Maokai_6.jpg', 'Maokai_7.jpg', 'MasterYi_0.jpg', 'MasterYi_1.jpg', 'MasterYi_10.jpg', 'MasterYi_11.jpg', 'MasterYi_17.jpg', 'MasterYi_2.jpg', 'MasterYi_24.jpg', 'MasterYi_3.jpg', 'MasterYi_33.jpg', 'MasterYi_4.jpg', 'MasterYi_42.jpg', 'MasterYi_5.jpg', 'MasterYi_9.jpg', 'MissFortune_0.jpg', 'MissFortune_1.jpg', 'MissFortune_15.jpg', 'MissFortune_16.jpg', 'MissFortune_17.jpg', 'MissFortune_18.jpg', 'MissFortune_2.jpg', 'MissFortune_20.jpg', 'MissFortune_21.jpg', 'MissFortune_3.jpg', 'MissFortune_31.jpg', 'MissFortune_33.jpg', 'MissFortune_4.jpg', 'MissFortune_5.jpg', 'MissFortune_6.jpg', 'MissFortune_7.jpg', 'MissFortune_8.jpg', 'MissFortune_9.jpg', 'MonkeyKing_0.jpg', 'MonkeyKing_1.jpg', 'MonkeyKing_2.jpg', 'MonkeyKing_3.jpg', 'MonkeyKing_4.jpg', 'MonkeyKing_5.jpg', 'MonkeyKing_6.jpg', 'MonkeyKing_7.jpg', 'Mordekaiser_0.jpg', 'Mordekaiser_1.jpg', 'Mordekaiser_13.jpg', 'Mordekaiser_2.jpg', 'Mordekaiser_23.jpg', 'Mordekaiser_3.jpg', 'Mordekaiser_32.jpg', 'Mordekaiser_4.jpg', 'Mordekaiser_5.jpg', 'Mordekaiser_6.jpg', 'Morgana_0.jpg', 'Morgana_1.jpg', 'Morgana_10.jpg', 'Morgana_11.jpg', 'Morgana_17.jpg', 'Morgana_2.jpg', 'Morgana_26.jpg', 'Morgana_3.jpg', 'Morgana_39.jpg', 'Morgana_4.jpg', 'Morgana_41.jpg', 'Morgana_5.jpg', 'Morgana_50.jpg', 'Morgana_6.jpg', 'Nami_0.jpg', 'Nami_1.jpg', 'Nami_15.jpg', 'Nami_2.jpg', 'Nami_24.jpg', 'Nami_3.jpg', 'Nami_32.jpg', 'Nami_7.jpg', 'Nami_8.jpg', 'Nami_9.jpg', 'Nasus_0.jpg', 'Nasus_1.jpg', 'Nasus_10.jpg', 'Nasus_11.jpg', 'Nasus_16.jpg', 'Nasus_2.jpg', 'Nasus_25.jpg', 'Nasus_3.jpg', 'Nasus_4.jpg', 'Nasus_5.jpg', 'Nasus_6.jpg', 'Nautilus_0.jpg', 'Nautilus_1.jpg', 'Nautilus_2.jpg', 'Nautilus_3.jpg', 'Nautilus_4.jpg', 'Nautilus_5.jpg', 'Nautilus_6.jpg', 'Nautilus_9.jpg', 'Neeko_0.jpg', 'Neeko_1.jpg', 'Neeko_10.jpg', 'Neeko_11.jpg', 'Neeko_12.jpg', 'Neeko_21.jpg', 'Nidalee_0.jpg', 'Nidalee_1.jpg', 'Nidalee_11.jpg', 'Nidalee_18.jpg', 'Nidalee_2.jpg', 'Nidalee_27.jpg', 'Nidalee_29.jpg', 'Nidalee_3.jpg', 'Nidalee_4.jpg', 'Nidalee_5.jpg', 'Nidalee_6.jpg', 'Nidalee_7.jpg', 'Nidalee_8.jpg', 'Nidalee_9.jpg', 'Nilah_0.jpg', 'Nilah_1.jpg', 'Nocturne_0.jpg', 'Nocturne_1.jpg', 'Nocturne_16.jpg', 'Nocturne_2.jpg', 'Nocturne_3.jpg', 'Nocturne_4.jpg', 'Nocturne_5.jpg', 'Nocturne_6.jpg', 'Nocturne_7.jpg', 'Nunu_0.jpg', 'Nunu_1.jpg', 'Nunu_16.jpg', 'Nunu_2.jpg', 'Nunu_26.jpg', 'Nunu_3.jpg', 'Nunu_4.jpg', 'Nunu_5.jpg', 'Nunu_6.jpg', 'Nunu_7.jpg', 'Nunu_8.jpg', 'Olaf_0.jpg', 'Olaf_1.jpg', 'Olaf_15.jpg', 'Olaf_16.jpg', 'Olaf_2.jpg', 'Olaf_25.jpg', 'Olaf_3.jpg', 'Olaf_35.jpg', 'Olaf_4.jpg', 'Olaf_5.jpg', 'Olaf_6.jpg', 'Orianna_0.jpg', 'Orianna_1.jpg', 'Orianna_11.jpg', 'Orianna_2.jpg', 'Orianna_20.jpg', 'Orianna_3.jpg', 'Orianna_4.jpg', 'Orianna_5.jpg', 'Orianna_6.jpg', 'Orianna_7.jpg', 'Orianna_8.jpg', 'Ornn_0.jpg', 'Ornn_1.jpg', 'Ornn_2.jpg', 'Pantheon_0.jpg', 'Pantheon_1.jpg', 'Pantheon_16.jpg', 'Pantheon_2.jpg', 'Pantheon_25.jpg', 'Pantheon_26.jpg', 'Pantheon_3.jpg', 'Pantheon_36.jpg', 'Pantheon_4.jpg', 'Pantheon_5.jpg', 'Pantheon_6.jpg', 'Pantheon_7.jpg', 'Pantheon_8.jpg', 'Poppy_0.jpg', 'Poppy_1.jpg', 'Poppy_14.jpg', 'Poppy_15.jpg', 'Poppy_16.jpg', 'Poppy_2.jpg', 'Poppy_24.jpg', 'Poppy_3.jpg', 'Poppy_4.jpg', 'Poppy_5.jpg', 'Poppy_6.jpg', 'Poppy_7.jpg', 'Pyke_0.jpg', 'Pyke_1.jpg', 'Pyke_16.jpg', 'Pyke_25.jpg', 'Pyke_34.jpg', 'Pyke_44.jpg', 'Pyke_9.jpg', 'Qiyana_0.jpg', 'Qiyana_1.jpg', 'Qiyana_10.jpg', 'Qiyana_11.jpg', 'Qiyana_2.jpg', 'Qiyana_20.jpg', 'Qiyana_21.jpg', 'Quinn_0.jpg', 'Quinn_1.jpg', 'Quinn_14.jpg', 'Quinn_2.jpg', 'Quinn_3.jpg', 'Quinn_4.jpg', 'Quinn_5.jpg', 'Rakan_0.jpg', 'Rakan_1.jpg', 'Rakan_18.jpg', 'Rakan_2.jpg', 'Rakan_3.jpg', 'Rakan_4.jpg', 'Rakan_5.jpg', 'Rakan_9.jpg', 'Rammus_0.jpg', 'Rammus_1.jpg', 'Rammus_16.jpg', 'Rammus_17.jpg', 'Rammus_2.jpg', 'Rammus_3.jpg', 'Rammus_4.jpg', 'Rammus_5.jpg', 'Rammus_6.jpg', 'Rammus_7.jpg', 'Rammus_8.jpg', 'RekSai_0.jpg', 'RekSai_1.jpg', 'RekSai_17.jpg', 'RekSai_2.jpg', 'RekSai_9.jpg', 'Rell_0.jpg', 'Rell_1.jpg', 'Rell_10.jpg', 'Renata_0.jpg', 'Renata_1.jpg', 'Renekton_0.jpg', 'Renekton_1.jpg', 'Renekton_17.jpg', 'Renekton_18.jpg', 'Renekton_2.jpg', 'Renekton_26.jpg', 'Renekton_3.jpg', 'Renekton_4.jpg', 'Renekton_5.jpg', 'Renekton_6.jpg', 'Renekton_7.jpg', 'Renekton_8.jpg', 'Renekton_9.jpg', 'Rengar_0.jpg', 'Rengar_1.jpg', 'Rengar_15.jpg', 'Rengar_2.jpg', 'Rengar_23.jpg', 'Rengar_3.jpg', 'Rengar_30.jpg', 'Rengar_8.jpg', 'Riven_0.jpg', 'Riven_1.jpg', 'Riven_16.jpg', 'Riven_18.jpg', 'Riven_2.jpg', 'Riven_20.jpg', 'Riven_22.jpg', 'Riven_23.jpg', 'Riven_3.jpg', 'Riven_34.jpg', 'Riven_4.jpg', 'Riven_44.jpg', 'Riven_45.jpg', 'Riven_5.jpg', 'Riven_6.jpg', 'Riven_7.jpg', 'Rumble_0.jpg', 'Rumble_1.jpg', 'Rumble_13.jpg', 'Rumble_2.jpg', 'Rumble_3.jpg', 'Rumble_4.jpg', 'Ryze_0.jpg', 'Ryze_1.jpg', 'Ryze_10.jpg', 'Ryze_11.jpg', 'Ryze_13.jpg', 'Ryze_2.jpg', 'Ryze_20.jpg', 'Ryze_3.jpg', 'Ryze_4.jpg', 'Ryze_5.jpg', 'Ryze_6.jpg', 'Ryze_7.jpg', 'Ryze_8.jpg', 'Ryze_9.jpg', 'Samira_0.jpg', 'Samira_1.jpg', 'Samira_10.jpg', 'Samira_20.jpg', 'Sejuani_0.jpg', 'Sejuani_1.jpg', 'Sejuani_15.jpg', 'Sejuani_16.jpg', 'Sejuani_2.jpg', 'Sejuani_26.jpg', 'Sejuani_3.jpg', 'Sejuani_4.jpg', 'Sejuani_5.jpg', 'Sejuani_6.jpg', 'Sejuani_7.jpg', 'Sejuani_8.jpg', 'Senna_0.jpg', 'Senna_1.jpg', 'Senna_10.jpg', 'Senna_16.jpg', 'Senna_26.jpg', 'Senna_27.jpg', 'Senna_9.jpg', 'Seraphine_0.jpg', 'Seraphine_1.jpg', 'Seraphine_14.jpg', 'Seraphine_15.jpg', 'Seraphine_2.jpg', 'Seraphine_3.jpg', 'Seraphine_4.jpg', 'Sett_0.jpg', 'Sett_1.jpg', 'Sett_10.jpg', 'Sett_19.jpg', 'Sett_8.jpg', 'Sett_9.jpg', 'Shaco_0.jpg', 'Shaco_1.jpg', 'Shaco_15.jpg', 'Shaco_2.jpg', 'Shaco_23.jpg', 'Shaco_3.jpg', 'Shaco_4.jpg', 'Shaco_5.jpg', 'Shaco_6.jpg', 'Shaco_7.jpg', 'Shaco_8.jpg', 'Shen_0.jpg', 'Shen_1.jpg', 'Shen_15.jpg', 'Shen_16.jpg', 'Shen_2.jpg', 'Shen_22.jpg', 'Shen_3.jpg', 'Shen_4.jpg', 'Shen_40.jpg', 'Shen_5.jpg', 'Shen_6.jpg', 'Shyvana_0.jpg', 'Shyvana_1.jpg', 'Shyvana_2.jpg', 'Shyvana_3.jpg', 'Shyvana_4.jpg', 'Shyvana_5.jpg', 'Shyvana_6.jpg', 'Shyvana_8.jpg', 'Singed_0.jpg', 'Singed_1.jpg', 'Singed_10.jpg', 'Singed_2.jpg', 'Singed_3.jpg', 'Singed_4.jpg', 'Singed_5.jpg', 'Singed_6.jpg', 'Singed_7.jpg', 'Singed_8.jpg', 'Singed_9.jpg', 'Sion_0.jpg', 'Sion_1.jpg', 'Sion_14.jpg', 'Sion_2.jpg', 'Sion_22.jpg', 'Sion_3.jpg', 'Sion_30.jpg', 'Sion_4.jpg', 'Sion_5.jpg', 'Sivir_0.jpg', 'Sivir_1.jpg', 'Sivir_10.jpg', 'Sivir_16.jpg', 'Sivir_2.jpg', 'Sivir_25.jpg', 'Sivir_3.jpg', 'Sivir_34.jpg', 'Sivir_4.jpg', 'Sivir_43.jpg', 'Sivir_5.jpg', 'Sivir_6.jpg', 'Sivir_7.jpg', 'Sivir_8.jpg', 'Sivir_9.jpg', 'Skarner_0.jpg', 'Skarner_1.jpg', 'Skarner_2.jpg', 'Skarner_3.jpg', 'Skarner_4.jpg', 'Skarner_5.jpg', 'Sona_0.jpg', 'Sona_1.jpg', 'Sona_17.jpg', 'Sona_2.jpg', 'Sona_26.jpg', 'Sona_3.jpg', 'Sona_35.jpg', 'Sona_4.jpg', 'Sona_5.jpg', 'Sona_6.jpg', 'Sona_7.jpg', 'Sona_9.jpg', 'Soraka_0.jpg', 'Soraka_1.jpg', 'Soraka_15.jpg', 'Soraka_16.jpg', 'Soraka_17.jpg', 'Soraka_18.jpg', 'Soraka_2.jpg', 'Soraka_3.jpg', 'Soraka_4.jpg', 'Soraka_5.jpg', 'Soraka_6.jpg', 'Soraka_7.jpg', 'Soraka_8.jpg', 'Soraka_9.jpg', 'Swain_0.jpg', 'Swain_1.jpg', 'Swain_11.jpg', 'Swain_12.jpg', 'Swain_2.jpg', 'Swain_3.jpg', 'Swain_4.jpg', 'Sylas_0.jpg', 'Sylas_1.jpg', 'Sylas_13.jpg', 'Sylas_14.jpg', 'Sylas_24.jpg', 'Sylas_8.jpg', 'Syndra_0.jpg', 'Syndra_1.jpg', 'Syndra_16.jpg', 'Syndra_2.jpg', 'Syndra_25.jpg', 'Syndra_3.jpg', 'Syndra_34.jpg', 'Syndra_4.jpg', 'Syndra_5.jpg', 'Syndra_6.jpg', 'Syndra_7.jpg', 'TahmKench_0.jpg', 'TahmKench_1.jpg', 'TahmKench_11.jpg', 'TahmKench_2.jpg', 'TahmKench_20.jpg', 'TahmKench_3.jpg', 'Taliyah_0.jpg', 'Taliyah_1.jpg', 'Taliyah_11.jpg', 'Taliyah_2.jpg', 'Taliyah_3.jpg', 'Talon_0.jpg', 'Talon_1.jpg', 'Talon_12.jpg', 'Talon_2.jpg', 'Talon_20.jpg', 'Talon_29.jpg', 'Talon_3.jpg', 'Talon_38.jpg', 'Talon_39.jpg', 'Talon_4.jpg', 'Talon_5.jpg', 'Taric_0.jpg', 'Taric_1.jpg', 'Taric_2.jpg', 'Taric_3.jpg', 'Taric_4.jpg', 'Taric_9.jpg', 'Teemo_0.jpg', 'Teemo_1.jpg', 'Teemo_14.jpg', 'Teemo_18.jpg', 'Teemo_2.jpg', 'Teemo_25.jpg', 'Teemo_27.jpg', 'Teemo_3.jpg', 'Teemo_37.jpg', 'Teemo_4.jpg', 'Teemo_5.jpg', 'Teemo_6.jpg', 'Teemo_7.jpg', 'Teemo_8.jpg', 'Thresh_0.jpg', 'Thresh_1.jpg', 'Thresh_13.jpg', 'Thresh_14.jpg', 'Thresh_15.jpg', 'Thresh_17.jpg', 'Thresh_2.jpg', 'Thresh_27.jpg', 'Thresh_28.jpg', 'Thresh_3.jpg', 'Thresh_38.jpg', 'Thresh_4.jpg', 'Thresh_5.jpg', 'Thresh_6.jpg', 'Tristana_0.jpg', 'Tristana_1.jpg', 'Tristana_10.jpg', 'Tristana_11.jpg', 'Tristana_12.jpg', 'Tristana_2.jpg', 'Tristana_24.jpg', 'Tristana_3.jpg', 'Tristana_33.jpg', 'Tristana_4.jpg', 'Tristana_40.jpg', 'Tristana_41.jpg', 'Tristana_5.jpg', 'Tristana_6.jpg', 'Trundle_0.jpg', 'Trundle_1.jpg', 'Trundle_2.jpg', 'Trundle_3.jpg', 'Trundle_4.jpg', 'Trundle_5.jpg', 'Trundle_6.jpg', 'Tryndamere_0.jpg', 'Tryndamere_1.jpg', 'Tryndamere_10.jpg', 'Tryndamere_18.jpg', 'Tryndamere_2.jpg', 'Tryndamere_3.jpg', 'Tryndamere_4.jpg', 'Tryndamere_5.jpg', 'Tryndamere_6.jpg', 'Tryndamere_7.jpg', 'Tryndamere_8.jpg', 'Tryndamere_9.jpg', 'TwistedFate_0.jpg', 'TwistedFate_1.jpg', 'TwistedFate_10.jpg', 'TwistedFate_11.jpg', 'TwistedFate_13.jpg', 'TwistedFate_2.jpg', 'TwistedFate_23.jpg', 'TwistedFate_25.jpg', 'TwistedFate_3.jpg', 'TwistedFate_4.jpg', 'TwistedFate_5.jpg', 'TwistedFate_6.jpg', 'TwistedFate_7.jpg', 'TwistedFate_8.jpg', 'TwistedFate_9.jpg', 'Twitch_0.jpg', 'Twitch_1.jpg', 'Twitch_12.jpg', 'Twitch_2.jpg', 'Twitch_27.jpg', 'Twitch_3.jpg', 'Twitch_36.jpg', 'Twitch_4.jpg', 'Twitch_45.jpg', 'Twitch_5.jpg', 'Twitch_6.jpg', 'Twitch_7.jpg', 'Twitch_8.jpg', 'Udyr_0.jpg', 'Udyr_1.jpg', 'Udyr_2.jpg', 'Udyr_3.jpg', 'Udyr_4.jpg', 'Udyr_5.jpg', 'Urgot_0.jpg', 'Urgot_1.jpg', 'Urgot_15.jpg', 'Urgot_2.jpg', 'Urgot_3.jpg', 'Urgot_9.jpg', 'Varus_0.jpg', 'Varus_1.jpg', 'Varus_16.jpg', 'Varus_17.jpg', 'Varus_2.jpg', 'Varus_3.jpg', 'Varus_34.jpg', 'Varus_4.jpg', 'Varus_5.jpg', 'Varus_6.jpg', 'Varus_7.jpg', 'Varus_9.jpg', 'Vayne_0.jpg', 'Vayne_1.jpg', 'Vayne_10.jpg', 'Vayne_11.jpg', 'Vayne_12.jpg', 'Vayne_13.jpg', 'Vayne_14.jpg', 'Vayne_15.jpg', 'Vayne_2.jpg', 'Vayne_25.jpg', 'Vayne_3.jpg', 'Vayne_32.jpg', 'Vayne_33.jpg', 'Vayne_4.jpg', 'Vayne_5.jpg', 'Vayne_6.jpg', 'Veigar_0.jpg', 'Veigar_1.jpg', 'Veigar_13.jpg', 'Veigar_2.jpg', 'Veigar_23.jpg', 'Veigar_3.jpg', 'Veigar_32.jpg', 'Veigar_4.jpg', 'Veigar_41.jpg', 'Veigar_5.jpg', 'Veigar_6.jpg', 'Veigar_7.jpg', 'Veigar_8.jpg', 'Veigar_9.jpg', 'Velkoz_0.jpg', 'Velkoz_1.jpg', 'Velkoz_11.jpg', 'Velkoz_2.jpg', 'Velkoz_3.jpg', 'Velkoz_4.jpg', 'Vex_0.jpg', 'Vex_1.jpg', 'Viego_0.jpg', 'Viego_1.jpg', 'Viego_10.jpg', 'Viego_19.jpg', 'Viktor_0.jpg', 'Viktor_1.jpg', 'Viktor_14.jpg', 'Viktor_2.jpg', 'Viktor_3.jpg', 'Viktor_4.jpg', 'Viktor_5.jpg', 'Vi_0.jpg', 'Vi_1.jpg', 'Vi_11.jpg', 'Vi_12.jpg', 'Vi_2.jpg', 'Vi_20.jpg', 'Vi_29.jpg', 'Vi_3.jpg', 'Vi_4.jpg', 'Vi_5.jpg', 'Vladimir_0.jpg', 'Vladimir_1.jpg', 'Vladimir_14.jpg', 'Vladimir_2.jpg', 'Vladimir_21.jpg', 'Vladimir_3.jpg', 'Vladimir_30.jpg', 'Vladimir_4.jpg', 'Vladimir_5.jpg', 'Vladimir_6.jpg', 'Vladimir_7.jpg', 'Vladimir_8.jpg', 'Volibear_0.jpg', 'Volibear_1.jpg', 'Volibear_2.jpg', 'Volibear_3.jpg', 'Volibear_4.jpg', 'Volibear_5.jpg', 'Volibear_6.jpg', 'Volibear_7.jpg', 'Volibear_9.jpg', 'Warwick_0.jpg', 'Warwick_1.jpg', 'Warwick_10.jpg', 'Warwick_16.jpg', 'Warwick_2.jpg', 'Warwick_3.jpg', 'Warwick_35.jpg', 'Warwick_4.jpg', 'Warwick_5.jpg', 'Warwick_6.jpg', 'Warwick_7.jpg', 'Warwick_8.jpg', 'Warwick_9.jpg', 'Xayah_0.jpg', 'Xayah_1.jpg', 'Xayah_17.jpg', 'Xayah_2.jpg', 'Xayah_26.jpg', 'Xayah_28.jpg', 'Xayah_3.jpg', 'Xayah_4.jpg', 'Xayah_8.jpg', 'Xerath_0.jpg', 'Xerath_1.jpg', 'Xerath_12.jpg', 'Xerath_2.jpg', 'Xerath_3.jpg', 'Xerath_4.jpg', 'Xerath_5.jpg', 'XinZhao_0.jpg', 'XinZhao_1.jpg', 'XinZhao_13.jpg', 'XinZhao_2.jpg', 'XinZhao_20.jpg', 'XinZhao_27.jpg', 'XinZhao_3.jpg', 'XinZhao_36.jpg', 'XinZhao_4.jpg', 'XinZhao_5.jpg', 'XinZhao_6.jpg', 'Yasuo_0.jpg', 'Yasuo_1.jpg', 'Yasuo_10.jpg', 'Yasuo_17.jpg', 'Yasuo_18.jpg', 'Yasuo_2.jpg', 'Yasuo_3.jpg', 'Yasuo_35.jpg', 'Yasuo_36.jpg', 'Yasuo_45.jpg', 'Yasuo_54.jpg', 'Yasuo_55.jpg', 'Yasuo_9.jpg', 'Yone_0.jpg', 'Yone_1.jpg', 'Yone_10.jpg', 'Yone_19.jpg', 'Yone_26.jpg', 'Yorick_0.jpg', 'Yorick_1.jpg', 'Yorick_12.jpg', 'Yorick_2.jpg', 'Yorick_21.jpg', 'Yorick_3.jpg', 'Yorick_4.jpg', 'Yuumi_0.jpg', 'Yuumi_1.jpg', 'Yuumi_11.jpg', 'Yuumi_19.jpg', 'Yuumi_28.jpg', 'Yuumi_37.jpg', 'Zac_0.jpg', 'Zac_1.jpg', 'Zac_2.jpg', 'Zac_6.jpg', 'Zac_7.jpg', 'Zed_0.jpg', 'Zed_1.jpg', 'Zed_10.jpg', 'Zed_11.jpg', 'Zed_13.jpg', 'Zed_15.jpg', 'Zed_2.jpg', 'Zed_3.jpg', 'Zed_30.jpg', 'Zed_31.jpg', 'Zeri_0.jpg', 'Zeri_1.jpg', 'Zeri_10.jpg', 'Ziggs_0.jpg', 'Ziggs_1.jpg', 'Ziggs_14.jpg', 'Ziggs_2.jpg', 'Ziggs_23.jpg', 'Ziggs_24.jpg', 'Ziggs_3.jpg', 'Ziggs_4.jpg', 'Ziggs_5.jpg', 'Ziggs_6.jpg', 'Ziggs_7.jpg', 'Zilean_0.jpg', 'Zilean_1.jpg', 'Zilean_2.jpg', 'Zilean_3.jpg', 'Zilean_4.jpg', 'Zilean_5.jpg', 'Zilean_6.jpg', 'Zoe_0.jpg', 'Zoe_1.jpg', 'Zoe_18.jpg', 'Zoe_19.jpg', 'Zoe_2.jpg', 'Zoe_20.jpg', 'Zoe_9.jpg', 'Zyra_0.jpg', 'Zyra_1.jpg', 'Zyra_16.jpg', 'Zyra_2.jpg', 'Zyra_3.jpg', 'Zyra_4.jpg', 'Zyra_5.jpg', 'Zyra_6.jpg', 'Zyra_7.jpg']


let ratings = []


function saveRatings() {
    let savedString = ''
    for (let i = 0; i < ratings.length; i++) {
        savedString += ratings[i][0] + ' ' + ratings[i][1] + '/'
    }
    localStorage.setItem('lolSkinsRatings', savedString);
}

function loadRatings() {
    let loadedString = localStorage.getItem('lolSkinsRatings');
    let unpack = loadedString.split('/')
    let ratings = []
    for (let i = 0; i < unpack.length; i++) {
        ratings.push(unpack[i].split(' '))
    }
    ratings.pop()
    return ratings
}


function initRatings(method) {
    // method is either 'allZeros' or 'random' or 'load'
    if (method === 'allZeros') {
        for (let i = 0; i < allSkins.length; i++) {
            ratings.push(['0', '0'])
        }
    } else {
        if (method === 'random') {
            for (let i = 0; i < allSkins.length; i++) {
                ratings.push([10 * Math.random() - 5, 10 * Math.random() - 5])
            }
        } else {
            if (method === 'load') {
                ratings = loadRatings()
            }
        }

    }
}


initRatings('random')

let uniqueRatings = makeUniqueRatings()

////////////////////////////////////////////

function matrixDotVector(matrix, vector) {
    return [matrix[0] * vector[0] + matrix[1] * vector[1] + matrix[2] * vector[2],
        matrix[3] * vector[0] + matrix[4] * vector[1] + matrix[5] * vector[2],
        matrix[6] * vector[0] + matrix[7] * vector[1] + matrix[8] * vector[2]]
}


function norm(vector) {
    return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
}

function multiplyVector(lambda, vector) {
    return [vector[0] * lambda, vector[1] * lambda, vector[2] * lambda]
}

function crossProduct(u, v) {
    return [u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]]
}

function computeProjectionMatrix() {
    let u1 = [-cameraX, -cameraY, -cameraZ]
    let Z = canvasCenterZ + (canvasCenterX * cameraX + Math.min(1e4, canvasCenterY * cameraY)) / cameraZ
    let u2 = [canvasCenterX, canvasCenterY, canvasCenterZ - Z]
    let beta = Math.min(1e8, (Z - canvasCenterZ) / (canvasCenterY - (canvasCenterX * canvasCenterY) / cameraX))
    let alpha = -(cameraZ + cameraY * beta) / cameraX
    let u3 = [alpha, beta, 1]
    let u1Norm = norm(u1), u2Norm = norm(u2), u3Norm = norm(u3)
    let e1 = multiplyVector(1 / u1Norm, u1)
    let turn2 = Math.sign(u2[2])
    let e2 = multiplyVector(turn2 / u2Norm, u2)
    let turn3 = Math.sign(crossProduct(e1, e2)[0] * u3[0]) // pour avoir une base directe
    let e3 = multiplyVector(turn3 / u3Norm, u3)

    projectionMatrix = [e1[0], e2[0], e3[0],
        e1[1], e2[1], e3[1],
        e1[2], e2[2], e3[2]]
}


function projectOnCanvas(ke1, ke2, ke3) {
    let resX = scale * focalLength * ke3 / (ke1 + focalLength)
    let resY = scale * focalLength * ke2 / (ke1 + focalLength)
    return {x: displayCenterX + resX, y: displayCenterY - resY}
}


/////////////// Object classes

class Dot {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        this.cx = x
        this.cy = y

        this.skinIndex = 0
        this.skins = []
        for (let i = 0; i < allSkins.length; i++) {
            if (ratings[i][0] == this.x && ratings[i][1] == this.y) {
                this.skins.push(allSkins[i])
            }
        }
        console.log(this.skins)


        this.distanceToCamera = this.updateDistanceToCamera()
        this.size = sizeConstant / this.distanceToCamera
        this.color = 'hsla(' + Math.atan2(this.x, this.y) * (180 / Math.PI) + ',90%,' + (this.z - dz) * 10 + '%,' + this.distanceToCamera / rho + ')'
        this.isHovered = false
        this.isClicked = false
    }

    updateDistanceToCamera() {
        return Math.sqrt((this.x - cameraX) ** 2 + (this.y - cameraY) ** 2 + (this.z - cameraZ) ** 2)
    }

    project() {
        let projectionVector = matrixDotVector(projectionMatrix, [this.x, swap * this.y, swap * this.z])
        let projectionOnCanvas = projectOnCanvas(projectionVector[0], projectionVector[1], projectionVector[2])
        this.cx = projectionOnCanvas.x + dxDraw
        this.cy = projectionOnCanvas.y
        this.updateDistanceToCamera()
        this.checkHover()
    }

    updateSkinIndex(incr) {
        this.skinIndex += incr
        if (this.skinIndex < 0) {
            this.skinIndex = this.skins.length - 1
        } else {
            this.skinIndex = this.skinIndex % this.skins.length
        }
    }

    addSkin(skinID) {
        this.skins.push(skinID)
    }

    removeSkin(skinID) {
        let index = this.skins.indexOf(skinID)
        this.skins.splice(index, 1)
        this.skinIndex = 0
    }

    checkHover() {
        let distance = Math.sqrt((mouseX - this.cx) ** 2 + (mouseY - this.cy) ** 2)
        this.isHovered = (distance <= this.size)
        if (this.isHovered && mouseOn) {
            this.isClicked = true
        }
    }

    updateColor() {
        if (this.isHovered || this.isClicked) {
            this.color = 'white'
        } else {
            this.color = 'hsla(' + Math.atan2(this.x, this.y) * (180 / Math.PI) + ',90%,' + (20 + (this.z - dz) * 7) + '%,' + this.distanceToCamera / rho + ')'
        }

    }

    draw() {
        this.size = sizeConstant * this.distanceToCamera
        this.updateColor()
        ctx.fillStyle = this.color
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}


class Line {
    constructor(startEndOpacity) {
        this.startX = startEndOpacity[0][0]
        this.startY = startEndOpacity[0][1]
        this.startZ = startEndOpacity[0][2]
        this.endX = startEndOpacity[1][0]
        this.endY = startEndOpacity[1][1]
        this.endZ = startEndOpacity[1][2]

        this.opacity = startEndOpacity[2]

        this.csx = this.startX
        this.csy = this.startY
        this.cex = this.endX
        this.cey = this.endY

    }

    project() {
        let projectionVectorStart = matrixDotVector(projectionMatrix, [this.startX, swap * this.startY, swap * this.startZ])
        let projectionVectorEnd = matrixDotVector(projectionMatrix, [this.endX, swap * this.endY, swap * this.endZ])
        let projectionOnCanvasStart = projectOnCanvas(projectionVectorStart[0], projectionVectorStart[1], projectionVectorStart[2])
        let projectionOnCanvasEnd = projectOnCanvas(projectionVectorEnd[0], projectionVectorEnd[1], projectionVectorEnd[2])
        this.csx = projectionOnCanvasStart.x
        this.csy = projectionOnCanvasStart.y
        this.cex = projectionOnCanvasEnd.x
        this.cey = projectionOnCanvasEnd.y
    }

    draw() {
        ctx.strokeStyle = 'hsla(0, 100%, 100%,' + this.opacity + ')';
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.csx + dxDraw, this.csy);
        ctx.lineTo(this.cex + dxDraw, this.cey);
        ctx.stroke();
    }
}


class Legend {
    constructor(x, y, z, label, dx = 0, dy = 0, size = 30) {
        this.x = x
        this.y = y
        this.z = z
        this.label = label
        this.dx = dx
        this.dy = dy
        this.size = size

        this.cx = this.x
        this.cy = this.y
    }

    project() {
        let projectionVector = matrixDotVector(projectionMatrix, [this.x, swap * this.y, swap * this.z])
        let projectionOnCanvas = projectOnCanvas(projectionVector[0], projectionVector[1], projectionVector[2])

        this.cx = projectionOnCanvas.x
        this.cy = projectionOnCanvas.y
    }

    draw() {
        ctx.font = this.size + "px Roboto";
        ctx.fillStyle = 'white'
        ctx.fillText(this.label, this.cx + this.dx + dxDraw, this.cy + this.dy);
    }
}


//////////// Camera movement


function updateCameraXYZ() {
    cameraX = rho * Math.sin(theta) * Math.cos(phi)
    cameraY = rho * Math.sin(theta) * Math.sin(phi)
    cameraZ = rho * Math.cos(theta)
    canvasCenterX = (rho - focalLength) * Math.sin(theta) * Math.cos(phi)
    canvasCenterY = (rho - focalLength) * Math.sin(theta) * Math.sin(phi)
    canvasCenterZ = (rho - focalLength) * Math.cos(theta)
}

function rotateCamera() {
    spinX = (mouseX - pmouseX) * moveSensitivity;
    spinY = (mouseY - pmouseY) * moveSensitivity;
    let mag = Math.sqrt(spinX ** 2 + spinY ** 2);
    if (mag > maxMoveSpeed) {
        spinX *= maxMoveSpeed / mag;
        spinY *= maxMoveSpeed / mag;
    }
    theta = (theta + spinX) % (2 * Math.PI)
    if (theta < 0) {
        theta = 2 * Math.PI - 0.01
    } else {
        theta = Math.abs(theta)
    }

    //skip
    /* if (theta < 0.25) {
        theta = 6.1
    }
    else if (theta > 6.1) {
        theta = 0.25
    }
    else if (2.9 < theta && theta < 3.35) {
        theta = 3.1 + 0.25 * Math.sign(spinX)
    }
    console.log(phi) */
    swap = Math.sign(Math.PI - theta)
    phi = Math.min(phi + spinY, 0.8)
    updateCameraXYZ()
    computeProjectionMatrix()
}


function zoomCamera(zoom) {
    scale = Math.min(maxScale, Math.max(minScale, scale - zoom * zoomSensitivity))
}


////////////// Fusion sort to display dots in the right order (closer to the camera -> displayed later)

function fusion(array1, array2) {
    if (array1.length === 0) {
        return array2
    } else if (array2.length === 0) {
        return array1
    } else {
        if (array1[0].distanceToCamera >= array2[0].distanceToCamera) {
            return [array1[0]].concat(fusion(array1.slice(1), array2))
        } else {
            return [array2[0]].concat(fusion(array1, array2.slice(1)))
        }
    }
}

function sortDots(array) {
    let l = array.length
    if (l <= 1) {
        return array
    } else {
        let l2 = Math.floor(l / 2)
        return fusion(sortDots(array.slice(0, l2)), sortDots(array.slice(l2)))
    }
}


function makeUniqueRatings() {
    let formatRatings = []
    for (let i = 0; i < ratings.length; i++) {
        formatRatings.push(ratings[i][0] + '/' + ratings[i][1])
    }
    let formatUnique = Array.from(new Set(formatRatings));
    formatRatings = []
    for (let i = 0; i < formatUnique.length; i++) {
        formatRatings.push(formatUnique[i].split('/'))
    }
    return formatRatings
}

//////////////inputs/////////////////////
function mousePressed(e) {
    pmouseX = mouseX = e.offsetX;
    pmouseY = mouseY = e.offsetY;
    mouseOn = true;
}

function mouseReleased(e) {
    mouseOn = false;
}

function mouseDragged(e) {
    pmouseX = mouseX;
    pmouseY = mouseY;
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    if (mouseOn) {
        rotateCamera();
    }
}


function resizeCanvas() {
    width = canvas.width = (window.innerWidth);
    setTimeout(function () {
        height = canvas.height = (window.innerHeight);
    }, 0);
    centerX = width / 2;
    centerY = height / 2;
}


//////////// draw everything

function draw() {
    manageBar()
    if (sideOn) {
        dxDraw = -175
    } else {
        dxDraw = 0
    }

    dots = sortDots(dots);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < dots.length; i++) {
        dots[i].project()
    }

    let aDotIsHovered = false;
    for (let i = dots.length - 1; i >= 0; i--) {
        if (aDotIsHovered) {
            dots[i].isHovered = false
        } else {
            aDotIsHovered = dots[i].isHovered
        }
    }


    let lock = false
    if (mouseOn) {
        for (let i = 0; i < dots.length; i++) {
            if (lock) {
                dots[i].isClicked = false
            } else {
                lock = dots[i].isClicked
                selectedDotIndex = i
            }
        }
        if (!lock) {
            selectedDotIndex = -1
        }
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].draw()
    }

    for (let i = 0; i < lines.length; i++) {
        lines[i].project()
        lines[i].draw()
    }

    for (let i = 0; i < labels.length; i++) {
        labels[i].project()
        labels[i].draw()
    }

    requestAnimationFrame(draw);
}


///////////////////// User interface actions

function clickUp() {
    dots[selectedDotIndex].updateSkinIndex(-1)
    if (splashOn) {
        showSplash()
    }
}

function clickDown() {
    dots[selectedDotIndex].updateSkinIndex(1)
    if (splashOn) {
        showSplash()
    }
}

function showBar() {
    let imageLink = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + dots[selectedDotIndex].skins[dots[selectedDotIndex].skinIndex]
    console.log(imageLink)
    document.getElementById('loading').src = imageLink
    document.getElementById('scrollBar').style.display = "block";
    sideOn = true
}

function hideBar() {
    document.getElementById('scrollBar').style.display = "none";
    sideOn = false
    if (selectedDotIndex > -1) {
        dots[selectedDotIndex].isClicked = false
        selectedDotIndex = -1
    }
    hideSplash()
}

function manageBar() {
    if (selectedDotIndex > -1) {
        showBar()
    } else {
        hideBar()
    }
}


function showSplash() {
    splashOn = true
    let imageLink = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + dots[selectedDotIndex].skins[dots[selectedDotIndex].skinIndex]
    document.getElementById('splash').src = imageLink
    document.getElementById('splash').style.display = "block";
    document.getElementById('splashBackground').style.display = "block";
}

function hideSplash() {
    splashOn = false
    document.getElementById('splash').style.display = "none";
    document.getElementById('splashBackground').style.display = "none";
}

function updateCoolFlow() {
    let cool = document.getElementById('coolInput').value;
    let flow = document.getElementById('flowInput').value;
    let skinID = dots[selectedDotIndex].skins[dots[selectedDotIndex].skinIndex]
    let globSkinIndex = allSkins.indexOf(skinID)
    let createNewDot = true
    if (!(cool === '') && !(flow === '')) {
        document.getElementById('coolInput').value = '';
        document.getElementById('flowInput').value = '';
        for (let i = 0; i < dots.length; i++) {
            if (dots[i].x === ratings[globSkinIndex][0] && dots[i].y === ratings[globSkinIndex][1]) {
                dots[i].removeSkin(skinID)
            }
            if (dots[i].skins.length === 0) {
                hideSplash()
                dots.splice(i, 1)
            } else {
                if (dots[i].x === cool && dots[i].y === flow) {
                    dots[i].addSkin(skinID)
                    createNewDot = false
                }
            }
        }
    }
    ratings[globSkinIndex] = [cool, flow];
    if (createNewDot) {
        dots.push(new Dot(cool, flow, (cool ** 2 + flow ** 2) / 5 + dz))
    }
    hideBar();
    saveRatings()
}


//////////////////////////////////////////


/* function initPts(n) {
    for (let i = 0; i < n; i++) {
        let x = 10 * Math.random() - 5, y = 10 * Math.random() - 5, z = (x ** 2 + y ** 2) / 5 + dz
        dots.push(new Dot(x, y, z));
    }

    for (let i = 0; i < gridLines.length; i++) {
        lines.push(new Line(gridLines[i]));
    }

    labels = [new Legend(5.5, 0, -5, 'Cool'),
        new Legend(0, 5.5, -5, 'Flow'),
        new Legend(0, 0, 5.5, 'Reda', -31, 0),
    ]
} */

function initPts(n) {
    for (let i = 0; i < uniqueRatings.length; i++) {
        let x = uniqueRatings[i][0], y = uniqueRatings[i][1], z = (x ** 2 + y ** 2) / 5 + dz
        dots.push(new Dot(x, y, z));
    }

    for (let i = 0; i < gridLines.length; i++) {
        lines.push(new Line(gridLines[i]));
    }

    labels = [new Legend(6.5, 0, -5, 'Cool'),
        new Legend(5.2, 0, -5, '10', 0, 0, 16),
        new Legend(-5.2, 0, -5, '-10', 0, 0, 16),

        new Legend(0, 6.5, -5, 'Flow'),
        new Legend(0, 5.2, -5, '10', 0, 0, 16),
        new Legend(0, -5.2, -5, '-10', 0, 0, 16),

        new Legend(0, 0, 5.5, 'Reda', -31, 0),
        new Legend(0, 0, 5.2, '10', -10, 0, 16),
    ]
}


initPts();
draw();

resizeCanvas();

window.addEventListener('wheel', (e) => zoomCamera(e.deltaY))
window.addEventListener('mousedown', mousePressed);
window.addEventListener('mouseup', mouseReleased);
window.addEventListener('mousemove', mouseDragged);
window.onresize = resizeCanvas;
