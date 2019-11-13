CREATE TRIGGER ##########
    after INSERT OR UPDATE OR DELETE
    ON ##########."customer-reservations"
    FOR EACH ROW
    EXECUTE PROCEDURE ##########.notify();

CREATE OR REPLACE FUNCTION "##########".notify()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS $BODY$

BEGIN
 
  PERFORM pg_notify('##########', json_build_object(
				'table', TG_TABLE_NAME,
				'schema', TG_TABLE_SCHEMA,
				'op',    TG_OP,
				'data',  row_to_json(NEW)
		  )::text);
		  
  RETURN NEW;
END;

$BODY$;