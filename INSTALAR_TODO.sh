#!/bin/bash
echo "=== Instalando dependencias de proyectos ==="
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[1/12] Demo_Hooks..."
cd "$DIR/Demo_Hooks/Demo_Hooks" && npm install

echo "[2/12] Demo_Vue..."
cd "$DIR/Demo_Vue/demo_vue" && npm install

echo "[3/12] FrontBackEnd..."
cd "$DIR/FrontBackEnd" && npm install

echo "[4/12] FrontBackEndPosgreSQL..."
cd "$DIR/FrontBackEndPosgreSQL" && npm install

echo "[5/12] NodeJsBackendIntro..."
cd "$DIR/NodeJsBackendIntro" && npm install

echo "[6/12] ProfeList..."
cd "$DIR/ProfeList" && npm install

echo "[7/12] ReactDemo/my-app..."
cd "$DIR/ReactDemo/my-app" && npm install

echo "[8/12] ReactDemo/DemoSesion..."
cd "$DIR/ReactDemo/DemoSesion" && npm install

echo "[9/12] Strip_Pasarela_Demo..."
cd "$DIR/Strip_Pasarela_Demo" && npm install

echo "[10/12] Supabase-Auth..."
cd "$DIR/Supabase-Auth" && npm install

echo "[11/12] ToDo_Nuxt..."
cd "$DIR/ToDo_Nuxt" && npm install

echo "[12/12] HelloWorld..."
cd "$DIR/HelloWorld" && npm install

echo "✅ Todas las dependencias instaladas"
