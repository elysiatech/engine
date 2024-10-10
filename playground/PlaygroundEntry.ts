import "./Menu.ts";
import "../src/UI/Panel.ts";
import "../src/UI/Theme.ts";

document.body.style.width = "100%";
document.body.style.height = "100vh";
document.body.style.margin = "0";

if(import.meta.DEV)
{
	new EventSource('/esbuild').addEventListener('change', () => location.reload());
}

const theme = document.createElement("elysia-theme")
document.body.appendChild(document.createElement("elysia-menu"))
theme.appendChild(document.createElement("elysia-floating-panel-test"))
document.body.appendChild(theme)

switch(location.search)
{
	case "":
		import("./HelloCube.ts");
		break;
	case "?physics":
		import("./PhysicsSandbox.ts");
		break;
}