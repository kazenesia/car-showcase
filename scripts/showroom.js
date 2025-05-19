const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let scene;
let camera;
let currentCarIndex = 0;
let carMeshes = [];

const carData = [
  {
    name: "Ford Mustang Hoonicorn 1965 (Custom)",
    file: "car1.glb",
    scale: 2.5,
    specs: {
      model: "Ford",
      year: "1965",
      engine: "6.7L V8",
      horsepower: "845 hp"
    }
  },
  {
    name: "Deus Vayanne Concept 2022",
    file: "car2.glb",
    scale: 2.5,
    specs: {
      model: "Deus Vayenne",
      year: "2022",
      engine: "Unknown (Electric)",
      horsepower: "2,200 hp"
    }
  },
  {
    name: "Ford GT40 2005",
    file: "car3.glb",
    scale: 2.5,
    specs: {
      model: "Ford",
      year: "2005",
      engine: "5.4L V8",
      horsepower: "550 hp"
    }
  },
  {
    name: "Bugatti Centodieci 2019",
    file: "car4.glb",
    scale: 2.5,
    specs: {
      model: "Bugatti",
      year: "2019",
      engine: "W16 8.0L Quad-Turbo",
      horsepower: "1600 hp"
    }
  },
  {
    name: "Falcon F7 2012",
    file: "car5.glb",
    scale: 2.5,
    specs: {
      model: "Falcon",
      year: "2012",
      engine: "7.0L LS7 V8",
      horsepower: "629 hp"
    }
  },
  {
    name: "Bugatti EB110 1992",
    file: "car6.glb",
    scale: 2.5,
    specs: {
      model: "Bugatti",
      year: "1992",
      engine: "3.5L V12 Quad-Turbo",
      horsepower: "560 hp"
    }
  }
];

window.addEventListener("DOMContentLoaded", () => {
  scene = createScene();
  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", () => {
    engine.resize();
  });
});

function createScene() {
  scene = new BABYLON.Scene(engine);

  // Tambahkan environment HDR
  const envTex = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "https://playground.babylonjs.com/textures/environment.env",
    scene
  );
  scene.environmentTexture = envTex;
  scene.createDefaultSkybox(envTex, true, 1000);

  // Kamera
  camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2.5, Math.PI / 3, 15, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 40;

  // Cahaya
  const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 1), scene);
  hemi.intensity = 2;

  const dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, 2, 1), scene);
  dir.position = new BABYLON.Vector3(10, 20, 10);
  dir.intensity = 2;

  // Load model
  carData.forEach((car, index) => {
    BABYLON.SceneLoader.ImportMesh("", "models/", car.file, scene, (meshes) => {
      if (!meshes.length) {
        console.warn(`Gagal load: ${car.file}`);
        return;
      }

      const root = new BABYLON.TransformNode(`car${index}`, scene);
      meshes.forEach(mesh => {
        mesh.parent = root;
      });

      root.scaling = new BABYLON.Vector3(car.scale, car.scale, car.scale);
      root.rotation = new BABYLON.Vector3(0, Math.PI / 3, 0);
      root.position = new BABYLON.Vector3(1, 1, 1);

      root.setEnabled(index === 0);
      carMeshes[index] = root;

      if (index === 0) updateCameraToFit(root);
    });
  });

  return scene;
}

function selectCar(index) {
  if (carMeshes[currentCarIndex]) carMeshes[currentCarIndex].setEnabled(false);
  if (carMeshes[index]) {
    carMeshes[index].setEnabled(true);
    currentCarIndex = index;
    updateInfoPanel(index);
    updateCameraToFit(carMeshes[index]);
  }
}

function updateInfoPanel(index) {
  const panel = document.getElementById("infoPanel");
  const specs = carData[index].specs;

  panel.innerHTML = `
    <h2>${carData[index].name}</h2>
    <h3>Spesifikasi</h3>
    <ul>
      <li><strong>Merk:</strong> ${specs.model}</li>
      <li><strong>Tahun:</strong> ${specs.year}</li>
      <li><strong>Mesin:</strong> ${specs.engine}</li>
      <li><strong>Horsepower:</strong> ${specs.horsepower}</li>
    </ul>
  `;
}

function updateCameraToFit(mesh) {
  const bounding = mesh.getHierarchyBoundingVectors(true);

  // Deteksi jika bounding box invalid (semua nol atau kecil)
  const size = bounding.max.subtract(bounding.min);
  if (size.length() < 0.1) {
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.radius = 15;
    return;
  }

  const center = bounding.min.add(size.scale(0.5));
  const radius = size.length() * 0.6;

  camera.setTarget(center);
  camera.radius = radius;
}
