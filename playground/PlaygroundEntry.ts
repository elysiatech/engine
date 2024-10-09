import "./Menu.ts";

document.body.style.width = "100%";
document.body.style.height = "100vh";
document.body.style.margin = "0";

if(import.meta.DEV)
{
	new EventSource('/esbuild').addEventListener('change', () => location.reload());
}

document.body.appendChild(document.createElement("elysia-menu"))

const path = location.pathname;

switch(path)
{
	case "/":
		import("./HelloCube.ts");
		break;
	case "/physics":
		import("./PhysicsSandbox.ts");
		break;
}