$.response.contentType = "text/HTML";
var output ;
var ret_serv_valu = {};
var conn = $.db.getConnection();
var schem_name = $.request.parameters.get("check_1");
var pstmt = conn.prepareStatement("SELECT TABLE_NAME AS \"Table\" FROM  M_CS_TABLES WHERE SCHEMA_NAME = '"+schem_name+"'");
var rs = pstmt.executeQuery();
var rs1;
var pstmt1;
if (!rs.next()) 
{
 $.response.headers.set("Content-Language", $.session.language);	
 $.response.setBody( "Failed to retrieve data" );
 } 
else 
{
ret_serv_valu.schema_name = schem_name;
var table_names = [];
table_names.push(rs.getString(1));
while(rs.next())
{
table_names.push(rs.getString(1));
}
ret_serv_valu.table_values=table_names;
var column_val = [];
var conn = $.db.getConnection();
var i=0;
for (i; i<ret_serv_valu.table_values.length; i++)
	{
pstmt1 = conn.prepareStatement("SELECT COLUMN_NAME FROM TABLE_COLUMNS WHERE SCHEMA_NAME = \'"+schem_name+"\' AND TABLE_NAME = \'"+ret_serv_valu.table_values[i]+"\'");
rs1 = pstmt1.executeQuery();
if (!rs1.next())
	{ $.response.setBody( "Failed to retrieve data" );
	 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;}else{
column_val.push("-");
column_val.push(rs1.getString(1));
while(rs1.next())
{
column_val.push(rs1.getString(1));
}
	}}
ret_serv_valu.column_values=column_val;
rs1.close();
pstmt1.close();
	}
output = JSON.stringify(ret_serv_valu);
rs.close();
pstmt.close();
conn.close();
$.response.headers.set("Content-Language", $.session.language);
$.response.setBody(output);
