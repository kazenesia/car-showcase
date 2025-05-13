window.addEventListener('DOMContentLoaded', function () {
    // Get canvas element
    const canvas = document.getElementById('renderCanvas');

    // Create Babylon engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.95, 0.95, 0.95); // Warna background cerah

    // Camera
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;
    camera.wheelDeltaPercentage = 0.01;

    // Light
    const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light1.intensity = 1.0;

    const light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-1, -2, -1), scene);
    light2.position = new BABYLON.Vector3(20, 40, 20);
    light2.intensity = 0.6;

    // Load model (GLTF)
    BABYLON.SceneLoader.Append("assets/", "car_model.gltf", scene, function (scene) {
        console.log("Model loaded successfully!");
    }, null, function (scene, message) {
        console.error("Failed to load model:", message);
    });

    // Render loop
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Resize event
    window.addEventListener('resize', function () {
        engine.resize();
    });
});
