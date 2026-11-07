use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // BC patch (老板 2026-11-07): `hidden_at` marks a conversation "不显示"
        // — hidden from the sidebar's Recent view only, NOT archived. The row
        // still shows under its folder, which is also the way back (unhide).
        // NULL means visible; no backfill needed.
        manager
            .alter_table(
                Table::alter()
                    .table(Conversation::Table)
                    .add_column(ColumnDef::new(Conversation::HiddenAt).timestamp_with_time_zone())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Conversation::Table)
                    .drop_column(Conversation::HiddenAt)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Conversation {
    Table,
    HiddenAt,
}

#[cfg(test)]
mod tests {
    use super::*;
    use sea_orm_migration::sea_orm::{ConnectionTrait, Database, DbBackend, Statement};

    /// `up` adds a nullable `hidden_at` column; pre-existing rows default to NULL
    /// (visible).
    #[tokio::test]
    async fn up_adds_nullable_hidden_at_defaulting_null() {
        let conn = Database::connect("sqlite::memory:")
            .await
            .expect("open in-memory sqlite");
        conn.execute_unprepared(
            "CREATE TABLE conversation (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)",
        )
        .await
        .expect("create stub table");
        conn.execute_unprepared("INSERT INTO conversation (title) VALUES ('x')")
            .await
            .expect("insert row");

        Migration
            .up(&SchemaManager::new(&conn))
            .await
            .expect("run migration up");

        let rows = conn
            .query_all(Statement::from_string(
                DbBackend::Sqlite,
                "SELECT hidden_at FROM conversation".to_owned(),
            ))
            .await
            .expect("query rows");
        assert_eq!(rows.len(), 1);
        let hidden_at: Option<String> = rows[0].try_get("", "hidden_at").expect("hidden_at col");
        assert!(hidden_at.is_none(), "new column must default to NULL");
    }
}
