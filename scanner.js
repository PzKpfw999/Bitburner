/** @param {NS} ns **/
class Scanner {
	constructor(ns, start_server_name, max_depth = 20) {
		this.ns = ns;
		this.start = start_server_name;
		this.max_depth = max_depth;
		this.net = new Map();
	}
	scan() {
		this.net.clear();
		/*
		first value is the depth
		second value will help when drawing a tree,which indicate if the server is last one in the network
		*/
		this.net.set(this.start, [0, true]);
		this._scan(this.start);
		return this.net;
	}
	tree(sytle1=' │ ',sytle2='   ',sytle3=' ├-',sytle4=' └-') {
		if (this.net.size == 0) {
			this.scan();
		}
		var true_max_depth = 0;
		for (let server of this.net) {
			if (server[0] > true_max_depth)
				true_max_depth = server[0];
		}
		var draw_bar_on_col = [];
		for (let i = 0; i < true_max_depth; i++) 
		{
			draw_bar_on_col.push(false);
		}
		var output = '';
		for (let server of this.net) {
			for (let i = 1; i < server[1][0]; i++) 
			{
				if (draw_bar_on_col[i]) 
				{
					output += sytle1
				}
				else {
					output += sytle2
				}
			}
			if (server[1][1] == false) 
			{
				output += sytle3
				draw_bar_on_col[server[1][0]] = true;
			}
			else 
			{
				if (server[1][0] > 0) 
				{
					output += sytle4
					for (let i = server[1][0]; i < draw_bar_on_col.length; i++) 
					{
						draw_bar_on_col[i] = false;
					}
				}
			}
			output += server[0] + '\n';
		}
		return output;
	}
	_scan(host, depth = 0) {
		if (depth == this.max_depth) return;
		var servers = this.ns.scan(host);
		var last_one = '';
		for (let server of servers) {
			if (!this.net.has(server)) {
				last_one = server;
				this.net.set(server, [depth + 1, false]);
				this._scan(server, depth + 1);
			}
		}
		if (last_one != '') 
		{
			this.net.set(last_one, [depth + 1, true]);
		}
	}
}
export async function main(ns) {
	ns.disableLog('ALL');
	ns.enableLog('print');

	ns.tail();
	var scanner = new Scanner(ns, 'home', Infinity);
	var net = scanner.scan();
	ns.print(scanner.tree());
}
