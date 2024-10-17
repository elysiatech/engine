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

// const theme = document.createElement("elysia-theme")
// theme.appendChild(document.createElement("elysia-floating-panel-test"))
// document.body.appendChild(theme)

switch(location.search)
{
	case "":
		import("./HelloCube.ts");
		document.body.appendChild(document.createElement("elysia-menu"))
		break;
	case "?physics":
		import("./PhysicsSandbox.ts");
		document.body.appendChild(document.createElement("elysia-menu"))
		break;
	case "?transmission":
		import("./TransmissionMaterial.ts");
		document.body.appendChild(document.createElement("elysia-menu"))
		break;
	case "?halloween":
		import("./halloween/Entry.ts");
		break;
	case "?lifecycle":
		import("./Lifecycle.ts");
		break;
	default:
		import("./HelloCube.ts");
		document.body.appendChild(document.createElement("elysia-menu"))
		break;
}
